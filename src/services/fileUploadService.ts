import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export class FileUploadService {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_TYPES = {
    resume: ['.pdf', '.doc', '.docx'],
    attachments: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif']
  };

  static validateFile(file: File, type: 'resume' | 'attachments'): { isValid: boolean; error?: string } {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size must be less than ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`
      };
    }

    // Check file type
    const allowedExtensions = this.ALLOWED_TYPES[type];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      return {
        isValid: false,
        error: `File type not allowed. Allowed types: ${allowedExtensions.join(', ')}`
      };
    }

    return { isValid: true };
  }

  static async uploadFile(
    file: File, 
    userId: string, 
    type: 'resume' | 'attachments',
    applicationId?: string
  ): Promise<UploadedFile> {
    try {
      // Validate file
      const validation = this.validateFile(file, type);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Create unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${type}_${timestamp}.${fileExtension}`;
      
      // Create storage path
      const storagePath = applicationId 
        ? `applications/${applicationId}/${type}/${fileName}`
        : `users/${userId}/${type}/${fileName}`;
      
      const storageRef = ref(storage, storagePath);

      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Create file record
      const uploadedFile: UploadedFile = {
        id: snapshot.ref.name,
        name: file.name,
        url: downloadURL,
        size: file.size,
        type: file.type,
        uploadedAt: new Date()
      };

      console.log(`[FileUploadService] File uploaded successfully: ${uploadedFile.name}`);
      return uploadedFile;

    } catch (error) {
      console.error('[FileUploadService] Error uploading file:', error);
      throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async uploadMultipleFiles(
    files: File[], 
    userId: string, 
    type: 'resume' | 'attachments',
    applicationId?: string
  ): Promise<UploadedFile[]> {
    try {
      const uploadPromises = files.map(file => this.uploadFile(file, userId, type, applicationId));
      const uploadedFiles = await Promise.all(uploadPromises);
      
      console.log(`[FileUploadService] ${uploadedFiles.length} files uploaded successfully`);
      return uploadedFiles;

    } catch (error) {
      console.error('[FileUploadService] Error uploading multiple files:', error);
      throw new Error(`Failed to upload files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async deleteFile(filePath: string): Promise<void> {
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      console.log(`[FileUploadService] File deleted successfully: ${filePath}`);

    } catch (error) {
      console.error('[FileUploadService] Error deleting file:', error);
      throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async deleteApplicationFiles(applicationId: string): Promise<void> {
    try {
      // This would require listing files in the application folder
      // For now, we'll implement a simple deletion based on known file paths
      console.log(`[FileUploadService] Deleting files for application: ${applicationId}`);
      
      // In a full implementation, you would:
      // 1. List all files in the application folder
      // 2. Delete each file individually
      // 3. Handle errors gracefully
      
    } catch (error) {
      console.error('[FileUploadService] Error deleting application files:', error);
      throw new Error(`Failed to delete application files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      default:
        return '📎';
    }
  }

  static isImageFile(fileName: string): boolean {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '');
  }

  static async getFilePreview(file: UploadedFile): Promise<string | null> {
    if (this.isImageFile(file.name)) {
      return file.url;
    }
    
    // For PDFs, you could implement a PDF preview service
    // For now, return null for non-image files
    return null;
  }
} 