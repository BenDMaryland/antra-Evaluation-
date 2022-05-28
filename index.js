/// Next steps --- try to remove some of these variables from the global scope if possible 
//  make it so delete/ edit change the array so that it isnt reset when sorting 
// Search unicode char doesn't look right on android :( --- check IOS/MacOS
// possibly allow filtering based on other criteria 

let allAlbums
let searchBar = document.querySelector("#header___search-bar")
let AllAlbumsContainer = document.querySelector("#main__album-container")
let resultsHeader = document.getElementById("header__results")
let filterResults = document.querySelector("#header___filter-bar")
let searchResults

document.querySelector("#header___search-btn").addEventListener("click", searchHandler)
document.querySelector("#header___search-bar").addEventListener("keyup", (e) => { e.key === "Enter" && searchHandler() })
document.querySelector("#header___sort-btn").addEventListener("click", sortHandler)
document.querySelector("#header___filter-btn").addEventListener("click", filterHandler)

/// Handles search Ensure that users search is valid
function searchHandler() {
    if (searchBar.value === "") {alert("Please enter a valid search")  }
    else {
        //  this shows a loading bar until userss results are found 
        resultsHeader.innerHTML = `<img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921" alt="laoding" >`
        fetch(`https://itunes.apple.com/search?term=${searchBar.value}&media=music&entity=album&attribute=artistTerm&limit=200`)
            .then(r => r.json())
            .then(data => allAlbums = data.results) // sending only yhr results array helps make the code a bit dryer
            .then(allAlbums => displayAlbums()) 
            .catch(error => {
                alert (error);
                AllAlbumsContainer.textContent = ""
            })
    }
}

/// Displays albums --- is used by all other functions 
function displayAlbums() {

    // this shows the tools menu for filtering and sorting 
    document.getElementById("tools").hidden = false;
    document.getElementById("tools").style.display = "flex"

    // this clears the container incase there is anything already in here 
    AllAlbumsContainer.textContent = ""
    // error handling
    allAlbums.length == 0 ?
        resultsHeader.innerText = `No results results for ${searchBar.value}, please try again` :
        resultsHeader.innerText = `${allAlbums.length} results for ${searchBar.value}`
    allAlbums.forEach(album => {

        // create html items 
        let albumImg = document.createElement("img") //artworkUrl100
        let albumSection = document.createElement("section")
        let artistName = document.createElement("h1") //artistName
        let albumName = document.createElement("h3") //collectionName
        let albumPrice = document.createElement("p") //collectionPrice


        // appending them 
        let albumCard = AllAlbumsContainer.appendChild(albumSection)
        albumCard.appendChild(albumName).innerText = album.collectionName
        albumCard.appendChild(albumImg).src = album.artworkUrl60
        albumCard.appendChild(albumPrice).innerText = `$${album.collectionPrice}`
        albumCard.className = "card"


        // Deleting
        let deleteBtn = albumCard.appendChild(document.createElement("button"))
        deleteBtn.addEventListener("click", deleteHandler)
        deleteBtn.innerText = "delete"
        deleteBtn.id = album.collectionId

        //editing
        let editBtn = albumCard.appendChild(document.createElement("button"))
        editBtn.addEventListener("click", EditHandler)
        editBtn.innerText = "edit"
        editBtn.id = album.collectionId
    });
}

/// Below are some extras I added, they all work about the same way. - Rework the allAlbums array then call the displayAlbums  function to rerender
function sortHandler(e) {
    AllAlbumsContainer.innerHTML = ""
    allAlbums.sort((a, b) => (parseInt(a.collectionPrice) - parseInt(b.collectionPrice)))
    displayAlbums()
}

function deleteHandler(e) {
    e.target.parentNode.remove()

    // Below is an example of what I'd do to actually delete the item 

    // fetch(`https://some_URL/${this.id}`, {
    //     method: 'DELETE',
    // }
    // ).then(data => console.log(data))
    //     .then(allTodos = allTodos.filter(todo => todo.id != this.id))
}

function EditHandler(e) {
    // here we replace the H3 title with an input box 
    let newInput = document.createElement('input')
    let oldTitle = this.parentNode.firstChild
    let parent = this.parentNode
    parent.prepend(newInput)
    newInput.placeholder = oldTitle.innerText
    oldTitle.remove()

    // here we check for the user to enter a new example and then  once done we replace the old title with the new one 
    newInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            let newTitle = document.createElement('h3')
            this.parentNode.prepend(newTitle)
            newTitle.innerText = e.target.value
            newInput.remove()

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
    AllAlbumsContainer.innerHTML = ""
    allAlbums = allAlbums.filter(album => album.collectionPrice < filterResults.value && album)
    displayAlbums()
}

