// HARDCODED GitHub endpoint to get JSON input from GitHub API
var url = 'https://api.github.com/repos/walmartlabs/thorax/issues';


// Load the elements on the ith 10-issue page
function loadPage(i, reload) {

    // create new XMLHttpRequest object -> used to interact w/ servers (get data from URL w/o doing full page refresh)
    const xhr = new XMLHttpRequest();
    // open new connection to GitHub's server
    xhr.open('GET', url, true);


    // when request is received from GitHub process it here
    xhr.onload = function() {
        // parse API data into JSON
        const data = JSON.parse(this.response);


        // ********** CLEAR OLD PAGE **********

        // Overwrite the old 10 issues regardless -> only display 10 at a time
        document.getElementById("output").innerHTML = "";
        // if reloading after moreInfo page OR starting up for first time, clear moreInfoOutput
        if (reload) {
            document.getElementById("moreInfoOutput").innerHTML = "";
        }   
        // Reload pagination menu to set correct pagination page to be active
        document.getElementById('paginationMenu').innerHTML = "";


        // ********** CREATE PAGINATION MENU **********

        // calculate number of pages (at most 10 entries each) -> use integer division
        var numPages = Math.floor(data.length / 10);
        if (data.length % 10 != 0) {
            numPages += 1;
        }

        // given number of pages, create pagination menu
        for (var k = 0; k < numPages; k++) {
            let ul = document.getElementById('paginationMenu');
            let li = document.createElement('li');
            li.classList.add('page-item');
            // make current page active
            if (k+1 == i) {
                li.classList.add('active');
            }
            li.innerHTML = (`
                <a class="page-link" onclick="loadPage(${k+1}, false)">${k+1}</a>
            `);
            ul.appendChild(li);
        }


        // ********** ADD UP TO 10 GITHUB ISSUES IN RANGE **********  

        // get the valid range 
        var endIndex = i * 10;
        var startIndex = (i-1) * 10;
        // case where there are less than 10 entries for this page 
        if (data.length < endIndex) {
            endIndex = data.length;
        }

        // Add a new li in the HTML for each GitHub Issue in range
        for (var j=startIndex; j < endIndex; j++) {
            let ul = document.getElementById('output');
            let li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerHTML = (`
                <p><strong>Title:</strong> ${data[j].title}</p>
                <p><strong>Issue #:</strong> ${data[j].number}</p>
                <p><strong>State:</strong> ${data[j].state}</p>
                <button onclick="getMoreInfo(${j})" type="button" class="btn btn-info">More Info</button>
            `);
            ul.appendChild(li);
        }
    }

    // send request to GitHub
    xhr.send();
}



// Load page with more info for given issue
function getMoreInfo(j) {

    // create new XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    // open new connection to GitHub's server
    xhr.open('GET', url, true);


    // when request is received from GitHub process it here
    xhr.onload = function() {
        // parse API data into JSON
        const data = JSON.parse(this.response);


        // ********** CLEAR OLD PAGE **********

        // Overwrite old page info -> only want extra info for given issue
        document.getElementById("paginationMenu").innerHTML = "";
        document.getElementById("output").innerHTML = "";


        // ********** CREATE NEW CONTENT (MORE INFO) **********

        // create new li w/ relevant information and put into HTML
        let ul = document.getElementById('moreInfoOutput');
        let li = document.createElement('li');
        li.classList.add('list-group-item');

        // to call the correct page , perform integer division by 10 then add 1
        let loadPageVal = Math.floor(j/10) + 1;
        li.innerHTML = (`
            <p><strong>Title:</strong> ${data[j].title}</p>
            <p><strong>Issue #:</strong> ${data[j].number}</p>
            <p><strong>State:</strong> ${data[j].state}</p>
            <p><strong>Owner:</strong> ${data[j].user.login}</p>
            <p><strong>Created Time:</strong> ${data[j].created_at}</p>
            <p><strong>Body:</strong> ${data[j].body}</p>
            <button onclick="loadPage(${loadPageVal},true)" type="button" class="btn btn-info">Go Back</button>
        `);
        ul.appendChild(li);
    }

    // send request to GitHub
    xhr.send();
} 



