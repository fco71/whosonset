import { db } from '../firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { Project, ProjectCrewMember, ProjectInvitation } from '../models/Project';

export class ProjectCrewService {
  private static readonly PROJECTS_COLLECTION = 'projects';

  /**
   * Add a crew member to a project
   */
  static async addCrewMember(
    projectId: string, 
    crewMember: Omit<ProjectCrewMember, 'joinedAt'>
  ): Promise<void> {
    try {
      const projectRef = doc(db, this.PROJECTS_COLLECTION, projectId);
      const projectDoc = await getDoc(projectRef);
      
      if (!projectDoc.exists()) {
        throw new Error('Project not found');
      }

      const projectData = projectDoc.data() as Project;
      const existingCrew = projectData.crewMembers || [];
      
      // Check if user is already a crew member
      const isAlreadyCrewMember = existingCrew.some(
        member => member.userId === crewMember.userId
      );
      
      if (isAlreadyCrewMember) {
        throw new Error('User is already a crew member of this project');
      }

      const newCrewMember: ProjectCrewMember = {
        ...crewMember,
        joinedAt: serverTimestamp()
      };

      await updateDoc(projectRef, {
        crewMembers: arrayUnion(newCrewMember),
        lastUpdated: serverTimestamp(),
        updateCount: (projectData.updateCount || 0) + 1
      });
    } catch (error) {
      console.error('Error adding crew member:', error);
      throw error;
    }
  }

  /**
   * Remove a crew member from a project
   */
  static async removeCrewMember(
    projectId: string, 
    userId: string,
    removedBy: string
  ): Promise<void> {
    try {
      const projectRef = doc(db, this.PROJECTS_COLLECTION, projectId);
      const projectDoc = await getDoc(projectRef);
      
      if (!projectDoc.exists()) {
        throw new Error('Project not found');
      }

      const projectData = projectDoc.data() as Project;
      const existingCrew = projectData.crewMembers || [];
      
      // Find the crew member to remove
      const crewMemberToRemove = existingCrew.find(
        member => member.userId === userId
      );
      
      if (!crewMemberToRemove) {
        throw new Error('Crew member not found in project');
      }

      // Check permissions
      const isOwner = projectData.owner_uid === removedBy;
      const isSelfRemoval = userId === removedBy;
      
      if (!isOwner && !isSelfRemoval) {
        throw new Error('Insufficient permissions to remove crew member');
      }

      if (isSelfRemoval && !crewMemberToRemove.canRemoveSelf) {
        throw new Error('You cannot remove yourself from this project');
      }

      // Remove the crew member
      const updatedCrew = existingCrew.filter(
        member => member.userId !== userId
      );

      await updateDoc(projectRef, {
        crewMembers: updatedCrew,
        lastUpdated: serverTimestamp(),
        updateCount: (projectData.updateCount || 0) + 1
      });
    } catch (error) {
      console.error('Error removing crew member:', error);
      throw error;
    }
  }

  /**
   * Get all projects where a user is a crew member
   */
  static async getProjectsForCrewMember(userId: string): Promise<Project[]> {
    try {
      const projectsRef = collection(db, this.PROJECTS_COLLECTION);
      const snapshot = await getDocs(projectsRef);
      const projects: Project[] = [];
      
      snapshot.forEach(doc => {
        const projectData = doc.data() as Project;
        const crewMembers = projectData.crewMembers || [];
        
        // Check if user is in the crew members array
        const isCrewMember = crewMembers.some(
          member => member.userId === userId && member.status === 'active'
        );
        
        if (isCrewMember) {
          projects.push({ id: doc.id, ...projectData });
        }
      });
      
      return projects;
    } catch (error) {
      console.error('Error getting projects for crew member:', error);
      throw error;
    }
  }

  /**
   * Get crew members for a project
   */
  static async getProjectCrewMembers(projectId: string): Promise<ProjectCrewMember[]> {
    try {
      const projectRef = doc(db, this.PROJECTS_COLLECTION, projectId);
      const projectDoc = await getDoc(projectRef);
      
      if (!projectDoc.exists()) {
        throw new Error('Project not found');
      }

      const projectData = projectDoc.data() as Project;
      return projectData.crewMembers || [];
    } catch (error) {
      console.error('Error getting project crew members:', error);
      throw error;
    }
  }

  /**
   * Check if a user is a crew member of a project
   */
  static async isUserCrewMember(projectId: string, userId: string): Promise<boolean> {
    try {
      const crewMembers = await this.getProjectCrewMembers(projectId);
      return crewMembers.some(member => 
        member.userId === userId && member.status === 'active'
      );
    } catch (error) {
      console.error('Error checking if user is crew member:', error);
      return false;
    }
  }

  /**
   * Update crew member permissions
   */
  static async updateCrewMemberPermissions(
    projectId: string,
    userId: string,
    permissions: Partial<ProjectCrewMember>
  ): Promise<void> {
    try {
      const projectRef = doc(db, this.PROJECTS_COLLECTION, projectId);
      const projectDoc = await getDoc(projectRef);
      
      if (!projectDoc.exists()) {
        throw new Error('Project not found');
      }

      const projectData = projectDoc.data() as Project;
      const existingCrew = projectData.crewMembers || [];
      
      const updatedCrew = existingCrew.map(member => 
        member.userId === userId 
          ? { ...member, ...permissions }
          : member
      );

      await updateDoc(projectRef, {
        crewMembers: updatedCrew,
        lastUpdated: serverTimestamp(),
        updateCount: (projectData.updateCount || 0) + 1
      });
    } catch (error) {
      console.error('Error updating crew member permissions:', error);
      throw error;
    }
  }

  /**
   * Invite a user to join a project
   */
  static async inviteCrewMember(
    projectId: string,
    invitation: Omit<ProjectInvitation, 'invitedAt' | 'status' | 'expiresAt'>
  ): Promise<void> {
    try {
      const projectRef = doc(db, this.PROJECTS_COLLECTION, projectId);
      const projectDoc = await getDoc(projectRef);
      
      if (!projectDoc.exists()) {
        throw new Error('Project not found');
      }

      const projectData = projectDoc.data() as Project;
      const existingInvitations = projectData.invitedCrewMembers || [];
      
      // Check if user is already invited
      const isAlreadyInvited = existingInvitations.some(
        invite => invite.userId === invitation.userId && invite.status === 'pending'
      );
      
      if (isAlreadyInvited) {
        throw new Error('User is already invited to this project');
      }

      // Check if user is already a crew member
      const existingCrew = projectData.crewMembers || [];
      const isAlreadyCrewMember = existingCrew.some(
        member => member.userId === invitation.userId
      );
      
      if (isAlreadyCrewMember) {
        throw new Error('User is already a crew member of this project');
      }

      const newInvitation: ProjectInvitation = {
        ...invitation,
        invitedAt: serverTimestamp(),
        status: 'pending',
        expiresAt: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) // 7 days
      };

      await updateDoc(projectRef, {
        invitedCrewMembers: arrayUnion(newInvitation),
        lastUpdated: serverTimestamp(),
        updateCount: (projectData.updateCount || 0) + 1
      });
    } catch (error) {
      console.error('Error inviting crew member:', error);
      throw error;
    }
  }

  /**
   * Accept or decline a project invitation
   */
  static async respondToInvitation(
    projectId: string,
    userId: string,
    response: 'accepted' | 'declined'
  ): Promise<void> {
    try {
      const projectRef = doc(db, this.PROJECTS_COLLECTION, projectId);
      const projectDoc = await getDoc(projectRef);
      
      if (!projectDoc.exists()) {
        throw new Error('Project not found');
      }

      const projectData = projectDoc.data() as Project;
      const existingInvitations = projectData.invitedCrewMembers || [];
      
      const invitation = existingInvitations.find(
        invite => invite.userId === userId && invite.status === 'pending'
      );
      
      if (!invitation) {
        throw new Error('No pending invitation found for this user');
      }

      if (response === 'accepted') {
        // Add user to crew members
        const newCrewMember: ProjectCrewMember = {
          userId: invitation.userId,
          userEmail: invitation.userEmail,
          displayName: invitation.displayName,
          role: invitation.role,
          department: invitation.department,
          joinedAt: serverTimestamp(),
          status: 'active',
          permissions: [],
          canEdit: false,
          canInvite: false,
          canRemoveSelf: true
        };

        const existingCrew = projectData.crewMembers || [];
        
        await updateDoc(projectRef, {
          crewMembers: arrayUnion(newCrewMember),
          invitedCrewMembers: existingInvitations.map(invite => 
            invite.userId === userId 
              ? { ...invite, status: 'accepted' }
              : invite
          ),
          lastUpdated: serverTimestamp(),
          updateCount: (projectData.updateCount || 0) + 1
        });
      } else {
        // Mark invitation as declined
        await updateDoc(projectRef, {
          invitedCrewMembers: existingInvitations.map(invite => 
            invite.userId === userId 
              ? { ...invite, status: 'declined' }
              : invite
          ),
          lastUpdated: serverTimestamp(),
          updateCount: (projectData.updateCount || 0) + 1
        });
      }
    } catch (error) {
      console.error('Error responding to invitation:', error);
      throw error;
    }
  }
} 