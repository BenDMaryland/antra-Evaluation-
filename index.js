// Next steps 
// footer 

let allAlbums = []
let searchBar = document.querySelector("#header___search-bar")
let allAlbumsContainer = document.querySelector("#main__album-container")
let resultsHeader = document.getElementById("header__results")



document.querySelector("#header___search-btn").addEventListener("click", searchHandler) //search button and enter key 
document.querySelector("#header___search-bar").addEventListener("keyup", (e) => { e.key === "Enter" && searchHandler() })

document.querySelector("#header___sort-btn").addEventListener("click", sortHandler)

document.querySelector("#header___filter-btn").addEventListener("click", filterHandler) /// filter button and enter key 
document.querySelector("#header___filter-bar").addEventListener("keyup", (e) => { e.key === "Enter" && filterHandler(e) })

document.querySelector('#form__add-container').addEventListener("submit", addCardHandler) // sumbit new card
document.querySelector('#header___add-btn').addEventListener("click", showForm)  //show form modal 



/// Handles search Ensure that users search is valid
function searchHandler() {
    if (searchBar.value.trim() === "") { alert("Please enter a valid search") }
    else {
        //  this shows a loading bar until users results are found 
        resultsHeader.innerHTML = `<img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921" alt="loading-gif" >`
        fetch(`https://itunes.apple.com/search?term=${searchBar.value}&media=music&entity=album&attribute=artistTerm&limit=200`)
            .then(r => r.json())
            .then(data => allAlbums = data.results) // sending only the results array helps make the code a bit dryer
            .then(allAlbums => displayAlbums())
            .catch(error => {
                clearContainer()
                resultsHeader.innerText = `No results results for ${searchBar.value}, please try again`
                document.getElementById("tools").hidden = true
            })
    }
}

/// Displays albums based on allAlbums array --- also clears existing entrys/ loading bar --- and displays result count 
function displayAlbums() {
console.log(allAlbums)
    // this shows the tools menu for filtering and sorting 
    document.getElementById("tools").hidden = false;
    document.getElementById("tools").style.display = "flex"

    // this clears the container incase there is anything already in here 
    clearContainer()
    // error handling
    allAlbums.length == 0 ?
        resultsHeader.innerText = `No results results for ${searchBar.value}, please try again` :
        resultsHeader.innerText = `${allAlbums.length} results for ${searchBar.value}`

    allAlbums.forEach(album => {

        // create html items 
        let albumImg = document.createElement("img") //artworkUrl100
        let albumSection = document.createElement("article")//collectionViewUrl
        let artistName = document.createElement("p") //artistName
        let albumName = document.createElement("h3") //collectionName
        let albumPrice = document.createElement("p") //collectionPrice


        // appending them 
        let albumCard = allAlbumsContainer.appendChild(albumSection)
        albumCard.appendChild(albumName).innerText = album.collectionName
        albumCard.appendChild(artistName).innerText = `by ${album.artistName}`
        albumCard.appendChild(albumImg).src = album.artworkUrl60
        albumCard.appendChild(albumPrice).innerText = `$${album.collectionPrice}`

        albumCard.className = "card"

        //when a user clicks on the albums image it rediects them to a new page 
        albumImg.addEventListener("click", () => { window.open(album.collectionViewUrl, '_blank') })


        // Deleting
        let deleteBtn = albumCard.appendChild(document.createElement("button"))
        deleteBtn.addEventListener("click", deleteHandler)
        deleteBtn.innerText = "delete"
        deleteBtn.id = album.collectionId

        //editing
        let editBtn = albumCard.appendChild(document.createElement("button"))
        editBtn.addEventListener("click", (e) => editHandler(e, album))
        editBtn.innerText = "edit"
        editBtn.id = album.collectionId
    });
}

// this clears all older entries 
function clearContainer() {
    allAlbumsContainer.textContent = ""
}

/// Below are some extras I added, they all work about the same way. - Rework the allAlbums array then call the displayAlbums  function to rerender
function sortHandler(e) {

    // first time sort is pressed it sorts by price --- after that it sorts by name 
    if (document.querySelector("#header___sort-btn").innerText === "Sort price") {
        allAlbums.sort((a, b) => (parseInt(a.collectionPrice) - parseInt(b.collectionPrice)))
        document.querySelector("#header___sort-btn").innerText = "Sort name"
        displayAlbums()
    }
    else {
        allAlbums.sort((a, b) => a.collectionName.localeCompare(b.collectionName))
        document.querySelector("#header___sort-btn").innerText = "Sort price"
        displayAlbums()
    }
}

function deleteHandler(e) {
    e.target.parentNode.remove()

    // Edits array saves this locally 
    allAlbums = allAlbums.filter(album => album.collectionId !== +this.id)

    /// updates album count 
    allAlbums.length == 0 ?
        resultsHeader.innerText = `No results results for ${searchBar.value}, please try again` :
        resultsHeader.innerText = `${allAlbums.length} results for ${searchBar.value}`

    // Below is an example of what I'd do to actually delete the item 

    // fetch(`https://some_URL/${this.id}`, {
    //     method: 'DELETE',
    // }
    // ).then(data => console.log(data))
    //     .then(allAlbums = allAlbums.filter(album => album.id != this.id))
}

function editHandler(e, album) {
    // here we replace the H3 title with an input box 
    let id = album.collectionId

    let newInput = document.createElement('input')
    let oldTitle = e.target.parentNode.firstChild
    let parent = e.target.parentNode
    parent.prepend(newInput)
    newInput.placeholder = oldTitle.innerText
    oldTitle.remove()

    // here we check for the user to enter a new example and then  once done we replace the old title with the new one 
    newInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            let newTitle = document.createElement('h3')
            e.target.parentNode.prepend(newTitle)
            newTitle.innerText = e.target.value
            newInput.remove()

            // Edit the array this saves it locally 
            console.log()
            allAlbums.map(album => album.collectionId === id ? album.collectionName = e.target.value : album)


            // example fetch request

            // fetch(`https://some_URL/${this.id}`, {
            //     method: 'PATCH',
            //     body: JSON.stringify({
            //         collectionName: e.target.value
            //     }),
            //     headers: {
            //         'Content-type': 'application/json; charset=UTF-8',
            //     },
            // })
            //     .then((response) => response.json())
            //     .then((json) => console.log(json));
        }
    })
}

function filterHandler(e) {
    let filterResults = document.querySelector("#header___filter-bar")
    allAlbums = allAlbums.filter(album => album.collectionPrice < filterResults.value && album)
    displayAlbums()
}

// This function adds cards to the all albums array 
function addCardHandler(e) {

    e.preventDefault()
    let obj = {
        artistName: document.getElementById("artist").value,
        collectionName: document.getElementById("collection-name").value,
        collectionPrice: document.getElementById("price").value,
        artworkUrl60: document.getElementById("collection-image").value
    }


    console.log(obj)
    allAlbums = [...allAlbums, obj]
    showForm()
    displayAlbums()
}

// shows the form modal 
function showForm() {
    let formContainer = document.querySelector("#form__add-container")

    if (formContainer.hidden === false) {
        formContainer.hidden = true
        document.querySelector('#header___add-btn').innerText = "Add song"
    }
    else {
        formContainer.hidden = false
        document.querySelector('#header___add-btn').innerText = "Close modal"
    }
}