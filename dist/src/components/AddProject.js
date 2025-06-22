import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import ProjectForm from './ProjectForm';
const AddProject = () => {
    const [projectName, setProjectName] = useState('');
    const [country, setCountry] = useState('');
    const [productionCompany, setProductionCompany] = useState('');
    const [status, setStatus] = useState('Pre-Production');
    const [logline, setLogline] = useState('');
    const [synopsis, setSynopsis] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [location, setLocation] = useState('');
    const [genre, setGenre] = useState('');
    const [director, setDirector] = useState('');
    const [producer, setProducer] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState('');
    // Removed posterImageUrl state
    const [projectWebsite, setProjectWebsite] = useState('');
    const [productionBudget, setProductionBudget] = useState('');
    const [productionCompanyContact, setProductionCompanyContact] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user) {
            try {
                const projectsCollectionRef = collection(db, 'Projects');
                // Only save if the URL is a real Firebase one
                const safeCoverUrl = coverImageUrl.startsWith('http') ? coverImageUrl : '';
                // Removed safePosterUrl
                await addDoc(projectsCollectionRef, {
                    projectName,
                    country,
                    productionCompany,
                    status,
                    logline,
                    synopsis,
                    startDate,
                    endDate,
                    location,
                    genre,
                    director,
                    producer,
                    coverImageUrl: safeCoverUrl,
                    // Removed posterImageUrl from document data
                    projectWebsite,
                    productionBudget,
                    productionCompanyContact,
                    isVerified,
                    owner_uid: user.uid,
                    createdAt: serverTimestamp(), // ✅ required for pagination
                });
                console.log('Project added successfully!');
                navigate('/');
            }
            catch (error) {
                console.error('Error adding project:', error.message);
            }
        }
        else {
            console.log('User not logged in.');
            navigate('/login');
        }
    };
    const handleCoverImageUploaded = (url) => {
        setCoverImageUrl(url); // Will always be Firebase URL
    };
    // Removed handlePosterImageUploaded
    const handleCancel = () => {
        navigate('/');
    };
    if (loading)
        return _jsx("p", { children: "Loading..." });
    if (error)
        return _jsxs("p", { children: ["Error: ", error.message] });
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-6 py-10", children: [_jsx("h2", { className: "text-3xl font-bold mb-8 text-center", children: "Add New Project" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-8 bg-white p-8 shadow-md rounded-lg", children: [_jsx(ProjectForm, { projectName: projectName, setProjectName: setProjectName, country: country, setCountry: setCountry, productionCompany: productionCompany, setProductionCompany: setProductionCompany, status: status, setStatus: setStatus, logline: logline, setLogline: setLogline, synopsis: synopsis, setSynopsis: setSynopsis, startDate: startDate, setStartDate: setStartDate, endDate: endDate, setEndDate: setEndDate, location: location, setLocation: setLocation, genre: genre, setGenre: setGenre, director: director, setDirector: setDirector, producer: producer, setProducer: setProducer, coverImageUrl: coverImageUrl, setCoverImageUrl: setCoverImageUrl, 
                        // Removed posterImageUrl and setPosterImageUrl props
                        projectWebsite: projectWebsite, setProjectWebsite: setProjectWebsite, productionBudget: productionBudget, setProductionBudget: setProductionBudget, productionCompanyContact: productionCompanyContact, setProductionCompanyContact: setProductionCompanyContact, isVerified: isVerified, setIsVerified: setIsVerified, handleCoverImageUploaded: handleCoverImageUploaded }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-end gap-4 pt-6", children: [_jsx("button", { type: "button", onClick: handleCancel, className: "w-full sm:w-auto px-6 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-md transition", children: "Cancel" }), _jsx("button", { type: "submit", className: "w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition", children: "Add Project" })] })] })] }));
};
export default AddProject;
