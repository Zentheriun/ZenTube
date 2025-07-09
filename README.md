# ZenChromi Project

<div align="center">
  <img src="https://github.com/Zentheriun/Zentheriun/blob/main/Resources/.IMGs/Web%20-%20ZenChromi.png" alt="ZenChromi Preview" width="700"/>
  <br>
  <em>Your gateway to a minimalist, user-centered search experience.</em>
</div>

<div align="center">
  
  [![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
  [![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
  [![Google Custom Search API](https://img.shields.io/badge/Google%20Custom%20Search%20API-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/custom-search/v1/overview)
  
</div>

---

## 🚀 Project Overview

**ZenChromi** is an innovative search engine designed to deliver a clean, fast, and distraction-free search experience. Built entirely with **vanilla JavaScript, HTML5, CSS3, and SCSS**, this project demonstrates how complex and efficient web applications can be constructed without relying on external frameworks or libraries. ZenChromi focuses on simplicity and functionality, providing relevant search results through an intuitive interface.

The application uses the **Google Custom Search API** to provide real-time search results, offering a fluid and responsive user experience.

---

## ✨ Key Features

* **Minimalist Interface**: A clean and organized design that allows users to focus on their searches.
* **Real-time Search Functionality**: Integration with the **Google Custom Search API** for instant results.
* **Multi-language Support**: (If applicable, you can mention it here. I saw that in your `index.html` you have logic for this.)
* **Responsive Design**: Optimized user experience for any device and screen size.
* **Built with Vanilla JavaScript, HTML5, CSS3, and SCSS**: Demonstrating solid frontend development skills without external dependencies.
* **Enhanced Accessibility**: Accessibility considerations for an inclusive experience.

---

## 🛠️ Technologies Used

* **HTML5**: For the semantic structure of the application.
* **CSS3**: For modern and responsive design.
* **SCSS**: CSS preprocessor for more efficient style organization and maintenance.
* **JavaScript (ES6+)**: For interactive logic and API handling.
* **Google Custom Search API**: For access to search data.

---

## 🚀 How to Run the Project Locally

To set up and run ZenChromi in your local environment, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Zentheriun/ZenChromi.git
    ```
2.  **Navigate to the project directory**:
    ```bash
    cd ZenChromi
    ```
3.  **Compile SCSS (if your SCSS files are not already compiled to CSS)**:
    * If you use an SCSS compiler (e.g., Sass CLI or a VS Code extension like Live Sass Compiler), make sure to compile your `.scss` files to `.css`.
    * If the `index.html` already includes the compiled CSS, you can skip this step, but it's good practice to mention it.
4.  **Configure your Google Custom Search API key**:
    * Go to [Google Custom Search API](https://developers.google.com/custom-search/v1/overview) and follow the instructions to get an **API Key**.
    * Create a **Custom Search Engine (CSE)** at [Google Custom Search](https://programmablesearchengine.google.com/cse/all).
    * Within your `index.html` file (or wherever you manage your credentials), locate the section where the Google Custom Search API is initialized.
    * **Insert your `API_KEY` and `CX_ID` (Search Engine ID)** in the designated places.
    * **Security Note:** For a production project, never expose your API Key directly in frontend code. It's recommended to use a server proxy to hide it. For this demo project, including it directly may be acceptable, but be aware of the risks.
5.  **Open `index.html` in your Browser (using a local server)**:
    * For API requests to work properly due to CORS policies, it's highly recommended to use a local server.
    * **Options for a local server:**
        * **Live Server (VS Code Extension):** If you use Visual Studio Code, install the "Live Server" extension and right-click on `index.html` to "Open with Live Server".
        * **Python Simple HTTP Server:** In your terminal, within the project directory, run:
            ```bash
            python -m http.server 8000
            ```
            Then navigate to `http://localhost:8000/index.html` in your browser.
        * **Node.js (http-server):** If you have Node.js, install `http-server` globally:
            ```bash
            npm install -g http-server
            ```
            Then, from the project directory, run:
            ```bash
            http-server
            ```
            And navigate to the provided URL.

---

## 📈 Performance and Compatibility

ZenChromi is optimized for speed and performance. It has been tested on major web browsers and devices to ensure a consistent and smooth experience.

---

## 🤝 Contributing

This project is primarily for educational and portfolio purposes. However, feedback and suggestions are welcome:

1.  Fork the repository.
2.  Create a branch for your new feature (`git checkout -b feature/enhancement`).
3.  Make your changes (`git commit -am 'Add new feature'`).
4.  Push to the branch (`git push origin feature/enhancement`).
5.  Open a Pull Request.

---

## 📄 License

This project is under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## 👨‍💻 Author

**Santiago Yate** - *Full Stack Developer*

-   GitHub: [@Zentheriun](https://github.com/Zentheriun)
-   LinkedIn: [Santiago Yate](https://www.linkedin.com/in/zentheriun/)

---

## 🙏 Acknowledgments

-   **Google Custom Search API** for providing access to real-time search data.
-   **MDN Web Docs** for comprehensive web development documentation.
-   **Font Awesome** for the icon collection.
-   **Google Fonts** for the `Inter` typography.
-   **The developer community** for continuous learning and inspiration.

---

<div align="center">
  <strong>⭐ Give this repository a star if you found it useful!</strong>
  <br>
  <em>This project demonstrates professional-level frontend development skills using vanilla JavaScript, HTML5, CSS3, and SCSS.</em>
</div>

---

**Disclaimer**: This is an educational project created for skill demonstration purposes. All content and search data are provided by the Google Custom Search API.
