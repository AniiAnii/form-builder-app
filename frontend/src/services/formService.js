import { createForm } from "../services/formService"; // ← Create this service 


export const getMyForms = async () => { 

  const res = await api.get("/forms"); 

  return res.data.forms; 

}; 

const handleSubmit = async (e) => { 

  e.preventDefault(); 

  try { 

    const data = await createForm({ title, description, allowGuests }); 

    alert(`Form "${data.form.title}" created!`); 

    navigate("/"); 

  } catch (err) { 

    setError(err?.response?.data?.message || "Failed to create form"); 

  } 

}; 