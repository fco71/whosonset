// src/components/ProjectDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth, storage } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

interface Project {
    id: string;
    projectName: string;
    country: string;
    productionCompany: string;
    status: string;
    logline: string;
    synopsis: string;
    startDate: string; // Expects a string (e.g., "YYYY-MM-DD" or "")
    endDate: string;   // Expects a string (e.g., "YYYY-MM-DD" or "")
    location: string;
    genre: string;
    director: string;
    producer: string;
    coverImageUrl: string;
    posterImageUrl: string;
    projectWebsite: string;
    productionBudget: string;
    productionCompanyContact: string;
    isVerified: boolean;
    owner_uid: string;
}

const ProjectDetail: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    // ADDED SNIPPET 2: Added saveSuccess state
    const [saveSuccess, setSaveSuccess] = useState(false);

    // State variables for editing
    const [projectName, setProjectName] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [productionCompany, setProductionCompany] = useState<string>('');
    const [status, setStatus] = useState<string>('Pre-Production');
    const [logline, setLogline] = useState<string>('');
    const [synopsis, setSynopsis] = useState<string>('');
    const [startDate, setStartDate] = useState<string>(''); // Initialized to empty string
    const [endDate, setEndDate] = useState<string>('');     // Initialized to empty string
    const [location, setLocation] = useState<string>('');
    const [genre, setGenre] = useState<string>('');
    const [director, setDirector] = useState<string>('');
    const [producer, setProducer] = useState<string>('');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [posterImage, setPosterImage] = useState<File | null>(null);
    const [coverImageUrl, setCoverImageUrl] = useState<string>('');
    const [posterImageUrl, setPosterImageUrl] = useState<string>('');
    const [projectWebsite, setProjectWebsite] = useState<string>('');
    const [productionBudget, setProductionBudget] = useState<string>('');
    const [productionCompanyContact, setProductionCompanyContact] = useState<string>('');
    const [isVerified, setIsVerified] = useState<boolean>(false);

    useEffect(() => {
        const fetchProject = async () => {
            setLoading(true);
            setError(null);
            try {
                if (projectId) {
                    const projectDocRef = doc(db, 'Projects', projectId);
                    const projectDocSnapshot = await getDoc(projectDocRef);

                    if (projectDocSnapshot.exists()) {
                        const firestoreData = projectDocSnapshot.data(); // Get raw data

                        // Create a complete project object with defaults for missing fields
                        // This ensures conformity with the Project interface and avoids undefined values for strings/booleans.
                        const projectWithDefaults: Project = {
                            id: projectDocSnapshot.id,
                            projectName: firestoreData.projectName || '',
                            country: firestoreData.country || '',
                            productionCompany: firestoreData.productionCompany || '',
                            status: firestoreData.status || 'Pre-Production', // Default if not present
                            logline: firestoreData.logline || '',
                            synopsis: firestoreData.synopsis || '',
                            startDate: firestoreData.startDate || '', // FIX: Default to empty string
                            endDate: firestoreData.endDate || '',     // FIX: Default to empty string
                            location: firestoreData.location || '',
                            genre: firestoreData.genre || '',
                            director: firestoreData.director || '',
                            producer: firestoreData.producer || '',
                            coverImageUrl: firestoreData.coverImageUrl || '',
                            posterImageUrl: firestoreData.posterImageUrl || '',
                            projectWebsite: firestoreData.projectWebsite || '',
                            productionBudget: firestoreData.productionBudget || '',
                            productionCompanyContact: firestoreData.productionCompanyContact || '',
                            isVerified: typeof firestoreData.isVerified === 'boolean' ? firestoreData.isVerified : false,
                            owner_uid: firestoreData.owner_uid || '', // Assuming owner_uid should ideally exist
                        };
                        setProject(projectWithDefaults);

                        // Initialize editing state variables from the sanitized 'projectWithDefaults'
                        setProjectName(projectWithDefaults.projectName);
                        setCountry(projectWithDefaults.country);
                        setProductionCompany(projectWithDefaults.productionCompany);
                        setStatus(projectWithDefaults.status);
                        setLogline(projectWithDefaults.logline);
                        setSynopsis(projectWithDefaults.synopsis);
                        setStartDate(projectWithDefaults.startDate); // Now defaults to '' if originally undefined
                        setEndDate(projectWithDefaults.endDate);     // Now defaults to '' if originally undefined
                        setLocation(projectWithDefaults.location);
                        setGenre(projectWithDefaults.genre);
                        setDirector(projectWithDefaults.director);
                        setProducer(projectWithDefaults.producer);
                        setCoverImageUrl(projectWithDefaults.coverImageUrl);
                        setPosterImageUrl(projectWithDefaults.posterImageUrl);
                        setProjectWebsite(projectWithDefaults.projectWebsite);
                        setProductionBudget(projectWithDefaults.productionBudget);
                        setProductionCompanyContact(projectWithDefaults.productionCompanyContact);
                        setIsVerified(projectWithDefaults.isVerified);

                    } else {
                        setError('Project not found.');
                    }
                } else {
                    setError('Project ID is missing.');
                }
            } catch (err: any) {
                console.error("Error fetching project:", err);
                setError(err.message || 'Failed to fetch project data.');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    const handleEditClick = () => {
        setIsEditing(true);
        // Note: No need to reset form fields here if they are already populated from useEffect
        // If you want to ensure they are reset from the `project` state every time edit is clicked:
        if (project) {
            setProjectName(project.projectName);
            setCountry(project.country);
            setProductionCompany(project.productionCompany);
            setStatus(project.status);
            setLogline(project.logline);
            setSynopsis(project.synopsis);
            setStartDate(project.startDate); // project.startDate is already sanitized
            setEndDate(project.endDate);     // project.endDate is already sanitized
            setLocation(project.location);
            setGenre(project.genre);
            setDirector(project.director);
            setProducer(project.producer);
            setCoverImageUrl(project.coverImageUrl);
            setPosterImageUrl(project.posterImageUrl);
            setProjectWebsite(project.projectWebsite);
            setProductionBudget(project.productionBudget);
            setProductionCompanyContact(project.productionCompanyContact);
            setIsVerified(project.isVerified);
            setCoverImage(null); // Clear any staged file
            setPosterImage(null); // Clear any staged file
            setError(null);
        }
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        // Reset fields to the original project values (which are now sanitized)
        if (project) {
            setProjectName(project.projectName);
            setCountry(project.country);
            setProductionCompany(project.productionCompany);
            setStatus(project.status);
            setLogline(project.logline);
            setSynopsis(project.synopsis);
            setStartDate(project.startDate); // project.startDate is already sanitized
            setEndDate(project.endDate);     // project.endDate is already sanitized
            setLocation(project.location);
            setGenre(project.genre);
            setDirector(project.director);
            setProducer(project.producer);
            setCoverImage(null);
            setPosterImage(null);
            setCoverImageUrl(project.coverImageUrl); // Reset to original URL
            setPosterImageUrl(project.posterImageUrl); // Reset to original URL
            setProjectWebsite(project.projectWebsite);
            setProductionBudget(project.productionBudget);
            setProductionCompanyContact(project.productionCompanyContact);
            setIsVerified(project.isVerified);
            setError(null); // Clear any previous save errors
        }
    };

    // ... (rest of your handleCoverImageChange, handlePosterImageChange, deleteOldImage, uploadImage functions remain the same)

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverImage(e.target.files[0]);
        } else {
            setCoverImage(null);
        }
    };

    const handlePosterImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPosterImage(e.target.files[0]);
        } else {
            setPosterImage(null);
        }
    };

    const deleteOldImage = async (url: string) => {
        if (!url || !url.startsWith("https://firebasestorage.googleapis.com/")) return; // Basic check
        try {
            const pathWithQuery = url.split("/o/")[1];
            if (!pathWithQuery) {
                console.warn("Could not parse path from old image URL:", url);
                return;
            }
            const encodedPath = pathWithQuery.split("?")[0];
            const decodedPath = decodeURIComponent(encodedPath);
            const oldRef = ref(storage, decodedPath);
            await deleteObject(oldRef);
            console.log("Old image deleted successfully:", decodedPath);
        } catch (e: any) {
            console.warn("Could not delete old image:", url, e.message);
        }
    };


    const uploadImage = async (imageFile: File | null, baseImageName: string) => {
        if (!imageFile) return '';
        if (!project) { // Should use projectId directly if project might not be fully set yet
            setError("Project context is missing for image upload.");
            return '';
        }
         if (!projectId) { // Guard against missing projectId
            setError("Project ID is missing for image upload.");
            return '';
        }


        if (!imageFile.type.startsWith("image/")) {
            setError("Please upload a valid image file (e.g., JPG, PNG).");
            return '';
        }

        const storageRef = ref(storage, `projects/${projectId}/${baseImageName}`); // Use projectId from params

        try {
            await uploadBytes(storageRef, imageFile);
            const downloadUrl = await getDownloadURL(storageRef);
            return downloadUrl;
        } catch (uploadError: any) {
            console.error("Error uploading image: ", uploadError);
            setError(`Image upload failed for ${baseImageName}: ${uploadError.message}`);
            return '';
        }
    };

    const handleSaveClick = async () => {
        if (!project || !projectId) { // Added !projectId check
            setError("Cannot save, project data or ID is missing.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let newCoverImageUrl = project.coverImageUrl;
            let newPosterImageUrl = project.posterImageUrl;

            if (coverImage) {
                if (project.coverImageUrl) {
                    await deleteOldImage(project.coverImageUrl);
                }
                // Ensure unique enough name using Date.now() and original extension
                const coverExtension = coverImage.name.split('.').pop() || 'jpg';
                newCoverImageUrl = await uploadImage(coverImage, `cover_${projectId}_${Date.now()}.${coverExtension}`);
                if (!newCoverImageUrl) {
                    setLoading(false);
                    return;
                }
            }

            if (posterImage) {
                if (project.posterImageUrl) {
                    await deleteOldImage(project.posterImageUrl);
                }
                const posterExtension = posterImage.name.split('.').pop() || 'jpg';
                newPosterImageUrl = await uploadImage(posterImage, `poster_${projectId}_${Date.now()}.${posterExtension}`);
                if (!newPosterImageUrl) {
                    setLoading(false);
                    return;
                }
            }

            const projectDocRef = doc(db, 'Projects', projectId); // Use projectId from params
            const updatedData: Omit<Project, 'id' | 'owner_uid'> = { // Be more precise about what's updatable
                projectName,
                country,
                productionCompany,
                status,
                logline,
                synopsis,
                startDate, // This state variable should now be '' if it was undefined, not undefined itself
                endDate,   // This state variable should now be '' if it was undefined, not undefined itself
                location,
                genre,
                director,
                producer,
                coverImageUrl: newCoverImageUrl,
                posterImageUrl: newPosterImageUrl,
                projectWebsite,
                productionBudget,
                productionCompanyContact,
                isVerified,
            };

            // console.log("Data being sent to updateDoc:", updatedData); // DEBUG line

            await updateDoc(projectDocRef, updatedData);

            setProject(prevProject => ({
                ...prevProject!, // We know project is not null here due to the guard clause
                ...updatedData,  // Spread the successfully updated fields
                id: projectId, // ensure id is present
                owner_uid: prevProject!.owner_uid // ensure owner_uid is present
            }));

            setCoverImage(null);
            setPosterImage(null);
            // The individual URL states (coverImageUrl, posterImageUrl) will be updated via setProject
            // Or if you want to keep them separate for some reason:
            setCoverImageUrl(newCoverImageUrl);
            setPosterImageUrl(newPosterImageUrl);

            setIsEditing(false);

            // ADDED SNIPPET 2: After successful save
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);

        } catch (saveError: any) {
            console.error("Error updating project:", saveError); // Log the full error
            setError(saveError.message || "Failed to save project changes.");
        } finally {
            setLoading(false);
        }
    };

    //  Define handleChange function
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProject(prevProject => ({
            ...prevProject!, // Assuming project is never null when editing
            [name]: value
        }));
    };

    // ... (rest of your JSX and loading/error display logic)
    // Make sure to use projectId from useParams in JSX where needed if project might be null initially

    if (loading && !project && !isEditing) { // More specific initial loading
        return <p>Loading project details...</p>;
    }

    if (loading && isEditing) {
        return <p>Uploading images and saving changes…</p>;
    }

    if (error && !isEditing && !project) { // Show error if project couldn't be fetched
        return <p>Error: {error}</p>;
    }

    if (!project) { // If still no project after loading/error checks (e.g. not found)
         return <p>{error || 'Project not found or not available.'}</p>; // Display existing error or generic message
    }

    // --- Render Logic from here assumes 'project' is not null ---

    return (
        <div>
            <h2>Project Detail for ID: {projectId}</h2> {/* Display projectId for clarity */}
            {/* REPLACED isEditing block with new form */}
            {isEditing ? (
              <form className="max-w-5xl mx-auto p-6 bg-white rounded shadow-md space-y-6">
                {error && <p className="text-red-600 text-sm">{error}</p>}
                {saveSuccess && <p className="text-green-500 text-sm">Project updated successfully!</p>}

                {/* Basic Details */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 border-b pb-1">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="projectName" className="block text-sm font-medium">Project Name</label>
                      <input type="text" id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium">Country</label>
                      <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label htmlFor="productionCompany" className="block text-sm font-medium">Production Company</label>
                      <input type="text" id="productionCompany" value={productionCompany} onChange={(e) => setProductionCompany(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium">Status</label>
                      <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full border rounded px-3 py-2">
                        <option value="Pre-Production">Pre-Production</option>
                        <option value="Production">Production</option>
                        <option value="Post-Production">Post-Production</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Story Details */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 border-b pb-1">Story Info</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="logline" className="block text-sm font-medium">Logline</label>
                      <textarea id="logline" value={logline} onChange={(e) => setLogline(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" rows={2} />
                    </div>
                    <div>
                      <label htmlFor="synopsis" className="block text-sm font-medium">Synopsis</label>
                      <textarea id="synopsis" value={synopsis} onChange={(e) => setSynopsis(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" rows={4} />
                    </div>
                  </div>
                </div>

                {/* Production Timeline */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 border-b pb-1">Production Timeline</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium">Start Date</label>
                      <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium">End Date</label>
                      <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
                    </div>
                     <div>
                      <label htmlFor="location" className="block text-sm font-medium">Location</label>
                      <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label htmlFor="genre" className="block text-sm font-medium">Genre</label>
                      <input type="text" id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
                    </div>
                  </div>
                </div>

                {/* Creatives */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 border-b pb-1">Creative Team</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="director" className="block text-sm font-medium">Director</label>
                      <input type="text" id="director" value={director} onChange={(e) => setDirector(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label htmlFor="producer" className="block text-sm font-medium">Producer</label>
                      <input type="text" id="producer" value={producer} onChange={(e) => setProducer(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
                    </div>
                  </div>
                </div>

                {/* Media Upload */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 border-b pb-1">Media</h3>
                  <div className="grid grid-cols-2 gap-4 items-start">
                    <div>
                      <label htmlFor="coverImage" className="block text-sm font-medium">Cover Image</label>
                      <input type="file" id="coverImage" accept="image/*" onChange={handleCoverImageChange} className="mt-1" />
                      {coverImage ? (
                        <img src={URL.createObjectURL(coverImage)} alt="Preview" className="w-36 mt-2 rounded shadow" />
                      ) : (
                        <img src={coverImageUrl} alt="Current Cover" className="w-36 mt-2 rounded shadow" />
                      )}
                    </div>
                    <div>
                      <label htmlFor="posterImage" className="block text-sm font-medium">Poster Image</label>
                      <input type="file" id="posterImage" accept="image/*" onChange={handlePosterImageChange} className="mt-1" />
                      {posterImage ? (
                        <img src={URL.createObjectURL(posterImage)} alt="Preview" className="w-36 mt-2 rounded shadow" />
                      ) : (
                        posterImageUrl && <img src={posterImageUrl} alt="Current Poster" className="w-36 mt-2 rounded shadow" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 border-b pb-1">Additional</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="projectWebsite" className="block text-sm font-medium">Website</label>
                      <input type="url" id="projectWebsite" value={projectWebsite} onChange={(e) => setProjectWebsite(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label htmlFor="productionBudget" className="block text-sm font-medium">Budget</label>
                      <input type="text" id="productionBudget" value={productionBudget} onChange={(e) => setProductionBudget(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label htmlFor="productionCompanyContact" className="block text-sm font-medium">Company Contact</label>
                      <input type="text" id="productionCompanyContact" value={productionCompanyContact} onChange={(e) => setProductionCompanyContact(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-4 border-t mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveClick}
                    disabled={loading}
                    className={`px-4 py-2 rounded text-white ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-10">
                {/* Basic Info */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-1">Basic Info</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1">Project Name</label>
                      <input
                        name="projectName"
                        value={project?.projectName || ''} // default value to empty string
                        onChange={handleChange}
                        className="w-full bg-gray-800 p-2 rounded border border-gray-700"
                        readOnly //disable editing of readonly view
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Status</label>
                      <select
                        name="status"
                        value={project?.status || ''} // default value to empty string
                        onChange={handleChange}
                        className="w-full bg-gray-800 p-2 rounded border border-gray-700"
                        disabled //disable editing of readonly view
                      >
                        <option value="">Select</option>
                        <option value="Pre-Production">Pre-Production</option>
                        <option value="Filming">Filming</option>
                        <option value="Post-Production">Post-Production</option>
                        <option value="Released">Released</option>
                      </select>
                    </div>
                  </div>
                   <div className="grid grid-cols-1">
                      <label className="block mb-1">Logline</label>
                      <input
                        name="logline"
                        value={project?.logline || ''} // default value to empty string
                        onChange={handleChange}
                        className="w-full bg-gray-800 p-2 rounded border border-gray-700"
                        readOnly //disable editing of readonly view
                      />
                   </div>
                    <div className="grid grid-cols-1">
                      <label className="block mb-1">Synopsis</label>
                      <textarea
                        name="synopsis"
                        value={project?.synopsis || ''} // default value to empty string
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-gray-800 p-2 rounded border border-gray-700"
                        readOnly //disable editing of readonly view
                      />
                  </div>
                </section>

                {/* Production Info */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-1">Production Info</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1">Production Company</label>
                      <input
                        name="productionCompany"
                        value={project?.productionCompany || ''} // default value to empty string
                        onChange={handleChange}
                        className="w-full bg-gray-800 p-2 rounded border border-gray-700"
                        readOnly //disable editing of readonly view
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Country</label>
                      <input
                        name="country"
                        value={project?.country || ''} // default value to empty string
                        onChange={handleChange}
                        className="w-full bg-gray-800 p-2 rounded border border-gray-700"
                        readOnly //disable editing of readonly view
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={project?.startDate || ''} // default value to empty string
                        onChange={handleChange}
                        className="w-full bg-gray-800 p-2 rounded border border-gray-700"
                         readOnly //disable editing of readonly view
                      />
                    </div>
                    <div>
                      <label className="block mb-1">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={project?.endDate || ''} // default value to empty string
                        onChange={handleChange}
                        className="w-full bg-gray-800 p-2 rounded border border-gray-700"
                         readOnly //disable editing of readonly view
                      />
                    </div>
                     <div className="md:col-span-2">
                      <label className="block mb-1">Location</label>
                      <input
                        name="location"
                        value={project?.location || ''} // default value to empty string
                        onChange={handleChange}
                        className="w-full bg-gray-800 p-2 rounded border border-gray-700"
                        readOnly //disable editing of readonly view
                      />
                    </div>
                  </div>
                </section>
                {auth.currentUser && project?.owner_uid && auth.currentUser.uid === project.owner_uid && (
                    //REPLACED with Snippet 1
                    <button onClick={() => setIsEditing(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Edit Project
                    </button>
                )}
                {/* ADDED Snippet 2 - Second Edit Button */}
                {auth.currentUser && project?.owner_uid && auth.currentUser.uid === project.owner_uid && (
                    <button onClick={() => setIsEditing(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Edit Project
                    </button>
                )}
              </div>
            )}
        </div>
    );
};

export default ProjectDetail;