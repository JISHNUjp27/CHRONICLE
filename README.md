# 📰 Chronicle — A Modern Blog Platform  

**Chronicle** is a modern blogging platform built with **React** and **Appwrite**, allowing users to create, edit, and share blog posts effortlessly.  
It features secure **email-password authentication**, **rich text editing** using TinyMCE, and **image uploads**, providing a complete and elegant blogging experience.  

---

## 🌍 Live Demo  

👉 **Visit Chronicle:** [https://chronicle-blog-ochre.vercel.app](https://chronicle-blog-ochre.vercel.app)  

---

## 🚀 Features  

- 🔐 **User Authentication**  
  - Secure login and signup with **email and password** via Appwrite.  

- 📝 **Create & Edit Posts**  
  - Add posts with a **title**, **cover image**, and **formatted content**.  
  - Use **TinyMCE editor** to style text, add links, lists, and media.  

- 🌐 **View Posts**  
  - Browse and read posts from all registered users.  
  - Clean and responsive UI for a smooth reading experience.  

- 🖼️ **Image Uploads**  
  - Upload post cover images directly using Appwrite Storage.  

---

## 🧰 Tech Stack  

| Category | Technology |
|-----------|-------------|
| Frontend | React (Vite) |
| Backend | Appwrite |
| Authentication | Appwrite Auth (Email & Password) |
| Rich Text Editor | TinyMCE |
| Deployment | Vercel |
| Styling | Tailwind CSS / Custom CSS |

---

## ⚙️ Setup Instructions  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/yourusername/chronicle.git
cd chronicle

npm install

VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
VITE_APPWRITE_BUCKET_ID=your_bucket_id

npm run dev
