/*=========================================================
  APPLICATION HUB
  app.js

  PART 1
  -------------------------
  ✓ Load JSON
  ✓ Global Variables
  ✓ Render Cards
=========================================================*/


//=========================================================
// ELEMENTS
//=========================================================

const projectGrid = document.getElementById("projectGrid");
const template = document.getElementById("projectTemplate");


//=========================================================
// GLOBAL DATA
//=========================================================

let projects = [];
let filteredProjects = [];


//=========================================================
// LOAD PROJECTS
//=========================================================

async function loadProjects() {

    try {

        const response = await fetch("data/projects.json");

        if (!response.ok) {

            throw new Error("Cannot load projects.json");

        }

        projects = await response.json();

        filteredProjects = [...projects];

        renderProjects(filteredProjects);

    }

    catch (error) {

        console.error(error);

        projectGrid.innerHTML = `

            <div class="empty-state">

                <h2>Unable to load data</h2>

                <p>${error.message}</p>

            </div>

        `;

    }

}



//=========================================================
// CREATE TAGS
//=========================================================

function createTags(tags = []) {

    return tags.map(tag => {

        return `<span>${tag}</span>`;

    }).join("");

}



//=========================================================
// STATUS CLASS
//=========================================================

function getStatusClass(status) {

    switch (status.toLowerCase()) {

        case "live":
            return "live";

        case "beta":
            return "beta";

        case "development":
            return "dev";

        case "archived":
            return "archive";

        default:
            return "";

    }

}



//=========================================================
// RENDER PROJECTS
//=========================================================

function renderProjects(data) {

    projectGrid.innerHTML = "";

    data.forEach(project => {

        const clone = template.content.cloneNode(true);

        //--------------------------------------------------
        // ELEMENT
        //--------------------------------------------------

        const img = clone.querySelector("img");

        const title = clone.querySelector(".title");

        const desc = clone.querySelector(".description");

        const status = clone.querySelector(".status");

        const category = clone.querySelector(".category");

        const tags = clone.querySelector(".tags");

        const visit = clone.querySelector(".visit-btn");


        //--------------------------------------------------
        // IMAGE
        //--------------------------------------------------

        img.src = project.thumbnail;

        img.alt = project.title;


        //--------------------------------------------------
        // TITLE
        //--------------------------------------------------

        title.textContent = project.title;


        //--------------------------------------------------
        // DESCRIPTION
        //--------------------------------------------------

        desc.textContent = project.description;


        //--------------------------------------------------
        // STATUS
        //--------------------------------------------------

        status.textContent = project.status;

        status.classList.add(

            getStatusClass(project.status)

        );


        //--------------------------------------------------
        // CATEGORY
        //--------------------------------------------------

        category.textContent = project.category;


        //--------------------------------------------------
        // TAGS
        //--------------------------------------------------

        tags.innerHTML = createTags(project.tags);


        //--------------------------------------------------
        // VISIT BUTTON
        //--------------------------------------------------

        visit.href = project.url;


        //--------------------------------------------------
        // ADD TO GRID
        //--------------------------------------------------

        projectGrid.appendChild(clone);

    });

}



//=========================================================
// INIT
//=========================================================

loadProjects();

