
//3. instead of "loading" something nice while loading





let allAlbums
let searchBar = document.querySelector("#header___search-bar")
let AllAlbumsContainer = document.querySelector("#main__album-container")
let resultsHeader = document.getElementById("header__results")
let searchResults

// document.querySelector("#sorter").addEventListener("click", sortHandler)
// document.querySelector("#filter").addEventListener("click", filterHandler)
///let url = https://itunes.apple.com/search?term=${ARTIST_NAME}&media=music&entity=album&attribute=artistTerm&limit=200


document.querySelector("#header___search-btn").addEventListener("click", searchHandler)
document.querySelector("#header___search-bar").addEventListener("keyup", (e) => { e.key === "Enter" && searchHandler() })

function searchHandler() {

    if (searchBar.value === "") {
        alert("Please enter a valid search")
        console.log("break")
    }
    else {
        resultsHeader.innerText = "◴"
        fetch(`https://itunes.apple.com/search?term=${searchBar.value}&media=music&entity=album&attribute=artistTerm&limit=200`)
            .then(r => r.json())
            .then(data => allAlbums = data)
            .then(allAlbums => displayAlbums())
    }
}

function displayAlbums() {
    console.log(allAlbums, searchResults)
    AllAlbumsContainer.textContent = ""

    allAlbums.resultCount == 0 ?
        resultsHeader.innerText = `No results results for ${searchBar.value}, please try again` :
        resultsHeader.innerText = `${allAlbums.resultCount} results for ${searchBar.value}`

    allAlbums.results.forEach(album => {

        // create html items 
        let albumImg = document.createElement("img") //artworkUrl100
        let albumSection = document.createElement("section")
        let artistName = document.createElement("h1") //artistName
        let albumName = document.createElement("h3") //collectionName

        // appending them 
        let albumCard = AllAlbumsContainer.appendChild(albumSection)
        albumCard.appendChild(albumName).innerText = album.collectionName
        albumCard.appendChild(albumImg).src = album.artworkUrl60
        albumCard.className = "card"

    });

}



    //◴ ◷ ◶ ◵

let example = {
    "wrapperType": "collection",
    "collectionType": "Album",
    "artistId": 15885,
    "collectionId": 529020307,
    "amgArtistId": 44890,
    "artistName": "Usher",
    "collectionName": "Versus",
    "collectionCensoredName": "Versus",
    "artistViewUrl": "https://music.apple.com/us/artist/usher/15885?uo=4",
    "collectionViewUrl": "https://music.apple.com/us/album/versus/529020307?uo=4",
    "artworkUrl60": "https://is2-ssl.mzstatic.com/image/thumb/Music114/v4/ec/d4/ff/ecd4ff16-1cbe-7d2c-df3f-cca0802943e8/884977695137.jpg/60x60bb.jpg",
    "artworkUrl100": "https://is2-ssl.mzstatic.com/image/thumb/Music114/v4/ec/d4/ff/ecd4ff16-1cbe-7d2c-df3f-cca0802943e8/884977695137.jpg/100x100bb.jpg",
    "collectionPrice": 7.99,
    "collectionExplicitness": "notExplicit",
    "trackCount": 9,
    "copyright": "℗ 2010 LaFace Records, a unit of Sony Music Entertainment",
    "country": "USA",
    "currency": "USD",
    "releaseDate": "2010-09-22T07:00:00Z",
    "primaryGenreName": "R&B/Soul"
}