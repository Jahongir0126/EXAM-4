"use strict";

let BASE_URL = "http://localhost:8080";


// -------------------------------DATA------------------------------------

const getAlldata = async () => {

    const response = await fetch(`${BASE_URL}/students`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();

    dataRender(data);
}
getAlldata();

// -------------------------------RENDER functions------------------------------------

function dataRender(data = []) {
    const count=createElement('span','', `${data.length}` )
    $(".count").appendChild(count)
    // const averageMark=createElement('span','',`Average mark :${count/}%`)
    
    data.forEach((e) => {
        const tr = createElement('tr', "tr",
            `<tr>
            <td>${e.id}</td>  
            <td>${e.name} ${e.lastname}</td>   
            <td>${e.marked_date}</td>
            <td>${e.mark}</td>
            <td>${e.mark>70 ? "Passed":"Failed"}</td>
            <td> <button class="btn btn-primary edit-btn" data-edit=${e.id}><i class="bi bi-pencil-square" data-edit=${e.id}></i></button></td>
            <td> <button class="btn btn-danger" data-del=${e.id}><i class="bi bi-trash-fill" data-del=${e.id}></i></button></td>
        </tr>
        `);

        $('.wrapper').appendChild(tr);
    })

}
// -------------------------------RENDER functions end------------------------------------


// ----------------------------POST --------------------------
function postData() {

    const isName = $("#name").value.trim();
    const isLastname = $('#lastname').value.trim();
    const isMark = $('#mark').value;
    let datenow = new Date();


    fetch(`${BASE_URL}/students`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: isName,
            lastname: isLastname,
            mark: isMark,
            marked_date: `${datenow.getHours()}:${datenow.getMinutes()}:${datenow.getSeconds()}`,

        })

    })



}
// AGAR BUG bolsa shuyerda :)  

$("#add-btn").addEventListener('click', (evt) => {
    evt.preventDefault();
    // $("#edit-btn").remove();
    postData();
})



// -------------------  DELETE FUNCTION -------------------------------

$(".wrapper").addEventListener("click", (e) => {
    if (
        e.target.classList.contains("btn-danger") ||
        e.target.classList.contains("bi-trash-fill")
    ) {
        const id = e.target.getAttribute("data-del");

        fetch(`${BASE_URL}/students/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        });

    }
});

// // -----------------EDIT FUNCTION ---------------------------------------
const studentsItem = async function (id) {
    const response = await fetch(`${BASE_URL}/students/${id}`);
    const {
        name,
        lastname,
        mark,
    } = await response.json();

    return {
        name,
        lastname,
        mark,
    };
}

$(".wrapper").addEventListener("click", (e) => {
    console.log(e.target.value);
    if (
        e.target.classList.contains("edit-btn") ||
        e.target.classList.contains("bi-pencil-square")
    ) {
        const id = e.target.getAttribute("data-edit");
        localStorage.setItem("editID", id)

        $(".modal-window").classList.remove("d-none");

        // const editBtn = createElement('button','btn btn-info w-100 mt-5 edit_btn','EDIT')       
        $("#add-btn") ?.remove();
        $("#edit-btn").classList.remove("d-none")

        // let isName = $('#setname').value;
        // let isPrice = $('#setprice').value;
        // let isDate = $('#setdate').value;

        let result = studentsItem(id);

        result.then((data) => {
            console.log(data.name);
            $("#name").value = data.name;
            $("#lastname").value = data.lastname;
            $("#mark").value = data.mark;
        });

    }
});

function editData() {
    const id = localStorage.getItem('editID');
    console.log(id);
    const isName = $("#name").value.trim();
    const isLastname = $("#lastname").value.trim();
    const isMark = $("#mark").value;
    let datenow = new Date();

    fetch(`${BASE_URL}/students/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: isName,
            lastname: isLastname,
            mark: isMark,
            marked_date: `${datenow.getHours()}:${datenow.getMinutes()}:${datenow.getSeconds()}`,

        }),
    });
}
$("#edit-btn").addEventListener('click', () => {

    editData()
})


// ------------------- MODAL WINDOW SCRIPTS ---------------

$("#addNew").addEventListener("click", (evt) => {
    localStorage.removeItem("editID")
    $(".modal-window").classList.remove("d-none")

})

function hideModal() {
    $(".modal-window").classList.add("d-none");

}


$(".close").addEventListener("click", () => {
    hideModal();
});


// ------------FILTER -----------------
const filterForm = $(".search-form");
//  $("#filter-name")


filterForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    const response = await fetch(`${BASE_URL}/students`, )
    const data = await response.json();

    

    function findStudent(e) {
            let result =e.filter((data)=>data.name.includes($("#filter-name").value.trim()));
            // console.log(result);
            filterByMark(result)
        
        
    }
    function renderFilter(data) {
        $('.wrapper').innerHTML="";
        $(".count").innerHTML="";
        const count=createElement('span','', `Count :${data.length}` )
        $(".count").appendChild(count)
        // const averageMark=createElement('span','',`Average mark :${count/}%`)

        data.forEach((e) => {
            const tr = createElement('tr', "tr",
                `<tr>
                <td>${e.id}</td>  
                <td>${e.name} ${e.lastname}</td>   
                <td>${e.marked_date}</td>
                <td>${e.mark}</td>
                <td>${e.mark>70 ? "Passed":"Failed"}</td>
                <td> <button class="btn btn-primary edit-btn" data-edit=${e.id}><i class="bi bi-pencil-square" data-edit=${e.id}></i></button></td>
                <td> <button class="btn btn-danger" data-del=${e.id}><i class="bi bi-trash-fill" data-del=${e.id}></i></button></td>
            </tr>
            `);
    
            $('.wrapper').appendChild(tr);
        })
    }

    findStudent(data)

    function filterByMark(item) {
        
            let result =item.filter(data=>data.mark >= $("#from").value && data.mark <=$("#to").value)
        
        renderFilter(result)
        
    }
    
})


