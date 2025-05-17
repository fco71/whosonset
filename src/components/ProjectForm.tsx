import React, { useState } from 'react';
import ImageUploader from './ImageUploader';

interface ProjectFormProps {
    projectName: string;
    setProjectName: (value: string) => void;
    country: string;
    setCountry: (value: string) => void;
    productionCompany: string;
    setProductionCompany: (value: string) => void;
    status: string;
    setStatus: (value: string) => void;
    logline: string;
    setLogline: (value: string) => void;
    synopsis: string;
    setSynopsis: (value: string) => void;
    startDate: string;
    setStartDate: (value: string) => void;
    endDate: string;
    setEndDate: (value: string) => void;
    location: string;
    setLocation: (value: string) => void;
    genre: string;
    setGenre: (value: string) => void;
    director: string;
    setDirector: (value: string) => void;
    producer: string;
    setProducer: (value: string) => void;
    coverImageUrl: string;
    setCoverImageUrl: (value: string) => void;
    posterImageUrl: string;
    setPosterImageUrl: (value: string) => void;
    projectWebsite: string;
    setProjectWebsite: (value: string) => void;
    productionBudget: string;
    setProductionBudget: (value: string) => void;
    productionCompanyContact: string;
    setProductionCompanyContact: (value: string) => void;
    isVerified: boolean;
    setIsVerified: (value: boolean) => void;
    handleCoverImageUploaded: (url: string) => void;
    handlePosterImageUploaded: (url: string) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
    projectName,
    setProjectName,
    country,
    setCountry,
    productionCompany,
    setProductionCompany,
    status,
    setStatus,
    logline,
    setLogline,
    synopsis,
    setSynopsis,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    location,
    setLocation,
    genre,
    setGenre,
    director,
    setDirector,
    producer,
    setProducer,
    coverImageUrl,
    setCoverImageUrl,
    posterImageUrl,
    setPosterImageUrl,
    projectWebsite,
    setProjectWebsite,
    productionBudget,
    setProductionBudget,
    productionCompanyContact,
    setProductionCompanyContact,
    isVerified,
    setIsVerified,
    handleCoverImageUploaded,
    handlePosterImageUploaded
}) => {
    return (
        <>
            <div>
                <label htmlFor="projectName">Project Name:</label>
                <input
                    type="text"
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName((e.target as HTMLInputElement).value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="country">Country:</label>
                <input
                    type="text"
                    id="country"
                    value={country}
                    onChange={(e) => setCountry((e.target as HTMLInputElement).value)}
                />
            </div>
            <div>
                <label htmlFor="productionCompany">Production Company:</label>
                <input
                    type="text"
                    id="productionCompany"
                    value={productionCompany}
                    onChange={(e) => setProductionCompany((e.target as HTMLInputElement).value)}
                />
            </div>
            <div>
                <label htmlFor="status">Status:</label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus((e.target as HTMLSelectElement).value)}
                >
                    <option value="Pre-Production">Pre-Production</option>
                    <option value="Filming">Filming</option>
                    <option value="Post-Production">Post-Production</option>
                    <option value="Completed">Completed</option>
                    <option value="Canceled">Canceled</option>
                </select>
            </div>
            <div>
                <label htmlFor="logline">Logline:</label>
                <textarea
                    id="logline"
                    value={logline}
                    onChange={(e) => setLogline((e.target as HTMLTextAreaElement).value)}
                />
            </div>
            <div>
                <label htmlFor="synopsis">Synopsis:</label>
                <textarea
                    id="synopsis"
                    value={synopsis}
                    onChange={(e) => setSynopsis((e.target as HTMLTextAreaElement).value)}
                />
            </div>
            <div>
                <label htmlFor="startDate">Start Date:</label>
                <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate((e.target as HTMLInputElement).value)}
                />
            </div>
            <div>
                <label htmlFor="endDate">End Date:</label>
                <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate((e.target as HTMLInputElement).value)}
                />
            </div>
            <div>
                <label htmlFor="location">Location:</label>
                <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation((e.target as HTMLInputElement).value)}
                />
            </div>
            <div>
                <label htmlFor="genre">Genre:</label>
                <input
                    type="text"
                    id="genre"
                    value={genre}
                    onChange={(e) => setGenre((e.target as HTMLInputElement).value)}
                />
            </div>
            <div>
                <label htmlFor="director">Director:</label>
                <input
                    type="text"
                    id="director"
                    value={director}
                    onChange={(e) => setDirector((e.target as HTMLInputElement).value)}
                />
            </div>
            <div>
                <label htmlFor="producer">Producer:</label>
                <input
                    type="text"
                    id="producer"
                    value={producer}
                    onChange={(e) => setProducer((e.target as HTMLInputElement).value)}
                />
            </div>
            <div>
                <label htmlFor="coverImageUrl">Cover Image:</label>
                <ImageUploader onImageUploaded={handleCoverImageUploaded} />
            </div>
            <div>
                <label htmlFor="posterImageUrl">Poster Image:</label>
                <ImageUploader onImageUploaded={handlePosterImageUploaded} />
            </div>
            <div>
                <label htmlFor="projectWebsite">Project Website:</label>
                <input
                    type="text"
                    id="projectWebsite"
                    value={projectWebsite}
                    onChange={(e) => setProjectWebsite((e.target as HTMLInputElement).value)}
                />
            </div>
            <div>
                <label htmlFor="productionBudget">Production Budget:</label>
                <input
                    type="text"
                    id="productionBudget"
                    value={productionBudget}
                    onChange={(e) => setProductionBudget((e.target as HTMLInputElement).value)}
                />
            </div>
            <div>
                <label htmlFor="productionCompanyContact">Production Company Contact:</label>
                <input
                    type="text"
                    id="productionCompanyContact"
                    value={productionCompanyContact}
                    onChange={(e) => setProductionCompanyContact((e.target as HTMLInputElement).value)}
                />
            </div>
            <div>
                <label htmlFor="isVerified">Is Verified:</label>
                <input
                    type="checkbox"
                    id="isVerified"
                    checked={isVerified}
                    onChange={(e) => setIsVerified(e.target.checked)}
                />
            </div>
        </>
    );
};

export default ProjectForm;