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


function searchHandler() {
    if (searchBar.value === "") {
        alert("Please enter a valid search")
    }
    else {
        resultsHeader.innerText = "◴"
        fetch(`https://itunes.apple.com/search?term=${searchBar.value}&media=music&entity=album&attribute=artistTerm&limit=200`)
            .then(r => r.json())
            .then(data => allAlbums = data.results)
            .then(allAlbums => displayAlbums())
    }
}

function displayAlbums() {
    console.log(allAlbums, searchResults)
    AllAlbumsContainer.textContent = ""
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

        let editBtn = albumCard.appendChild(document.createElement("button"))
        editBtn.addEventListener("click", EditHandler)
        editBtn.innerText = "edit"
        editBtn.id = album.collectionId
    });


}


function sortHandler(e) {
    console.log(allAlbums)
    AllAlbumsContainer.innerHTML = ""
    allAlbums.sort((a, b) => (parseInt(a.collectionPrice) - parseInt(b.collectionPrice)))
    displayAlbums()
}

function deleteHandler(e) {
    e.target.parentNode.remove()
    console.log(allAlbums)

    // Below is an example of what I'd do to actually delete the item 

    // console.log(e, this.id)
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
    console.log(filterResults.value)
    AllAlbumsContainer.innerHTML = ""
    allAlbums = allAlbums.filter(album => album.collectionPrice < filterResults.value && album)

    displayAlbums()

}


let exam = {
    "wrapperType": "collection",
    "collectionType": "Album",
    "artistId": 2715720,
    "collectionId": 1451901307,
    "amgArtistId": 353484,
    "artistName": "Kanye West",
    "collectionName": "Graduation",
    "collectionCensoredName": "Graduation",
    "artistViewUrl": "https://music.apple.com/us/artist/kanye-west/2715720?uo=4",
    "collectionViewUrl": "https://music.apple.com/us/album/graduation/1451901307?uo=4",
    "artworkUrl60": "https://is3-ssl.mzstatic.com/image/thumb/Music114/v4/db/ce/e7/dbcee73f-015e-d994-abe4-58fbdfd0569c/00602577027864.rgb.jpg/60x60bb.jpg",
    "artworkUrl100": "https://is3-ssl.mzstatic.com/image/thumb/Music114/v4/db/ce/e7/dbcee73f-015e-d994-abe4-58fbdfd0569c/00602577027864.rgb.jpg/100x100bb.jpg",
    "collectionPrice": 6.99,
    "collectionExplicitness": "explicit",
    "contentAdvisoryRating": "Explicit",
    "trackCount": 14,
    "copyright": "A Roc-A-Fella Records release; ℗ 2007 UMG Recordings, Inc.",
    "country": "USA",
    "currency": "USD",
    "releaseDate": "2007-09-11T07:00:00Z",
    "primaryGenreName": "Hip-Hop/Rap"
}