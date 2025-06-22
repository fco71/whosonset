import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/EditCrewProfile.tsx
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
const EditCrewProfile = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const [form, setForm] = useState({
        name: '',
        bio: '',
        profileImageUrl: '',
        jobTitles: [''],
        residences: [{ country: '', city: '' }],
    });
    const [jobOptions, setJobOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    // 1) Fetch lookup data
    useEffect(() => {
        const fetchLookups = async () => {
            // jobTitles
            const jobSnap = await getDocs(collection(db, 'jobTitles'));
            setJobOptions(jobSnap.docs.map(doc => doc.data().name));
            // countries
            const countrySnap = await getDocs(collection(db, 'countries'));
            setCountryOptions(countrySnap.docs.map(doc => ({
                name: doc.data().name,
                cities: doc.data().cities,
            })));
        };
        fetchLookups().catch(console.error);
    }, []);
    // 2) Load existing profile
    useEffect(() => {
        if (!currentUser)
            return;
        getDoc(doc(db, 'crewProfiles', currentUser.uid))
            .then(snap => {
            if (snap.exists()) {
                const data = snap.data();
                setForm(f => ({
                    ...f,
                    ...data,
                    jobTitles: data.jobTitles?.length
                        ? data.jobTitles
                        : [''],
                    residences: data.residences?.length
                        ? data.residences
                        : [{ country: '', city: '' }],
                }));
            }
        })
            .catch(console.error);
    }, [currentUser]);
    // Handlers (same as before)…
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };
    const handleProfileImageChange = async (e) => {
        if (!currentUser || !e.target.files?.[0])
            return;
        const file = e.target.files[0];
        const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setForm(f => ({ ...f, profileImageUrl: url }));
    };
    // Job titles add/remove/update
    const updateJobTitle = (i, v) => {
        setForm(f => {
            const jt = [...f.jobTitles];
            jt[i] = v;
            return { ...f, jobTitles: jt };
        });
    };
    const addJobTitle = () => setForm(f => ({ ...f, jobTitles: [...f.jobTitles, ''] }));
    const removeJobTitle = (i) => setForm(f => ({
        ...f,
        jobTitles: f.jobTitles.filter((_, idx) => idx !== i),
    }));
    // Residences add/remove/update
    const updateResidence = (i, key, value) => {
        setForm(f => {
            const rs = [...f.residences];
            rs[i] = { ...rs[i], [key]: value };
            return { ...f, residences: rs };
        });
    };
    const addResidence = () => setForm(f => ({
        ...f,
        residences: [...f.residences, { country: '', city: '' }],
    }));
    const removeResidence = (i) => setForm(f => ({
        ...f,
        residences: f.residences.filter((_, idx) => idx !== i),
    }));
    // Save
    const handleSave = async (e) => {
        e.preventDefault();
        if (!currentUser)
            return;
        setLoading(true);
        try {
            await setDoc(doc(db, 'crewProfiles', currentUser.uid), {
                ...form,
                uid: currentUser.uid,
            });
            setMessage('Profile saved!');
        }
        catch {
            setMessage('Failed to save.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-900 text-white p-8", children: _jsxs("div", { className: "max-w-2xl mx-auto bg-gray-800 p-6 rounded space-y-6", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Edit Crew Profile" }), _jsx("input", { name: "name", value: form.name, onChange: handleChange, placeholder: "Full Name", className: "w-full p-2 bg-gray-700 rounded" }), _jsx("textarea", { name: "bio", value: form.bio, onChange: handleChange, placeholder: "Short Bio", rows: 3, className: "w-full p-2 bg-gray-700 rounded" }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold mb-2", children: "Job Titles" }), form.jobTitles.map((jt, i) => (_jsxs("div", { className: "flex gap-2 mb-2", children: [_jsxs("select", { value: jt, onChange: e => updateJobTitle(i, e.target.value), className: "flex-1 p-2 bg-gray-700 rounded", children: [_jsx("option", { value: "", children: "\u2014 Select \u2014" }), jobOptions.map(opt => (_jsx("option", { value: opt, children: opt }, opt)))] }), form.jobTitles.length > 1 && (_jsx("button", { onClick: () => removeJobTitle(i), className: "text-red-400", children: "\u274C" }))] }, i))), _jsx("button", { onClick: addJobTitle, className: "text-blue-400 underline text-sm", children: "+ Add Title" })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold mb-2", children: "Residences" }), form.residences.map((res, i) => (_jsxs("div", { className: "flex gap-2 mb-2", children: [_jsxs("select", { value: res.country, onChange: e => updateResidence(i, 'country', e.target.value), className: "p-2 bg-gray-700 rounded", children: [_jsx("option", { value: "", children: "\u2014 Country \u2014" }), countryOptions.map(c => (_jsx("option", { value: c.name, children: c.name }, c.name)))] }), _jsxs("select", { value: res.city, onChange: e => updateResidence(i, 'city', e.target.value), disabled: !res.country, className: "p-2 bg-gray-700 rounded flex-1", children: [_jsx("option", { value: "", children: "\u2014 City (opt.) \u2014" }), countryOptions
                                            .find(c => c.name === res.country)
                                            ?.cities.map(city => (_jsx("option", { value: city, children: city }, city)))] }), form.residences.length > 1 && (_jsx("button", { onClick: () => removeResidence(i), className: "text-red-400", children: "\u274C" }))] }, i))), _jsx("button", { onClick: addResidence, className: "text-blue-400 underline text-sm", children: "+ Add Residence" })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1", children: "Profile Picture" }), _jsx("input", { type: "file", accept: "image/*", onChange: handleProfileImageChange }), form.profileImageUrl && (_jsxs("div", { className: "mt-2 flex items-center gap-4", children: [_jsx("img", { src: form.profileImageUrl, className: "h-20 w-20 rounded-full object-cover" }), _jsx("button", { onClick: () => setForm(f => ({ ...f, profileImageUrl: '' })), className: "text-red-400 underline text-sm", type: "button", children: "Remove" })] }))] }), _jsx("button", { onClick: handleSave, disabled: loading, className: "w-full bg-green-600 py-2 rounded hover:bg-green-500 disabled:opacity-50", children: loading ? 'Saving…' : 'Save Profile' }), message && (_jsx("p", { className: "text-center text-yellow-400", children: message }))] }) }));
};
export default EditCrewProfile;
