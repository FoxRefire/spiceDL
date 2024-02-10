(function spiceDL(){

    if (!Spicetify.React || !Spicetify.ReactDOM || !Spicetify.Platform) {
        setTimeout(spiceDL, 200);
        return;
    }

    const styleSheet = document.createElement("style")
    styleSheet.innerHTML =`
        .styled-table {
            margin: 25px 0;
            font-size: 0.9em;
            font-family: sans-serif;
            min-width: 400px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            border-radius: 8px;
        }
        .styled-table thead tr {
            background-color: var(--spice-sidebar);
            color: var(--spice-sidebar-text);
            text-align: left;
            border-bottom: thin solid #dddddd;
        }
        tbody td:nth-child(4) {
            text-align: center;
        }
        .styled-table th,
        .styled-table td {
            padding: 12px 15px;
            width: 1%;
            white-space: nowrap;
        }
        .styled-table tbody tr {
            border-bottom: thin solid #dddddd;
        }
        td.auto-skip {
            color: var(--spice-button-active);
        }
        .x-downloadButton-DownloadButton{
            display: none
        }
    `
    document.body.appendChild(styleSheet);

    //Downloads list window elements
    downloadList=Spicetify.React.createElement(
        'div',
        {},
        Spicetify.React.createElement('label', {}, 'Download Directory'),
        Spicetify.React.createElement('input', { type:"text", id:"directory", readonly:"true" }),
        Spicetify.React.createElement('button', { onClick:setDownloadDir }, 'Browse'),
        Spicetify.React.createElement('button', { onClick:resetDownloadDir }, 'Reset'),
        Spicetify.React.createElement(
            'table',
            { className: "styled-table", id: "downloads" },
            Spicetify.React.createElement(
                'thead',
                {},
                Spicetify.React.createElement(
                    'tr',
                    { },
                    Spicetify.React.createElement('th', { }, 'Name'),
                    Spicetify.React.createElement('th', { }, 'Status'),
                    Spicetify.React.createElement('th', { }, ' ')
                )
            ),
            Spicetify.React.createElement(
                'tbody',
                {}
            )
        )
    );

    //Wait downloads list window and add rows from spiceDL API
    setInterval(async () => {
        pointer=document.querySelector("#downloads > tbody")
        if(pointer){
            response=await fetch('http://127.0.0.1:8888/spicedl/status')
            json=await response.json()

            response=await fetch('http://localhost:8888/spicedl/downloadDir/get')
            directory=await response.text()
            document.querySelector("#directory").value=directory

            pointer.innerHTML="";
            Object.keys(json).forEach((uuid)=>{
                row = pointer.insertRow();

                row.insertCell().appendChild(document.createTextNode(json[uuid].name));
                row.insertCell().appendChild(document.createTextNode(json[uuid].status));
                row.insertCell().innerHTML='<button onclick=fetch("http://127.0.0.1:8888/spicedl/remove/'+uuid+'")>❌</button>'
            })
        }
    },800)

    //Downloading function
    async function startDownload(baseuri){
        url = apiurl = Spicetify.URI.fromString(baseuri[0]).toURL();
        [
            ["https://open.spotify.com/","https://api.spotify.com/v1/"],
            ["track","tracks"],["album","albums"],["playlist","playlists"],["artist","artists"]
        ].forEach((replace)=>apiurl=apiurl.replace(replace[0],replace[1]))
        response=await Spicetify.CosmosAsync.get(apiurl);
        fetch("http://127.0.0.1:8888/spicedl/start/"+encodeURIComponent(response.name)+"/"+encodeURIComponent(url))
    }

    function setDownloadDir(){
        fetch("http://127.0.0.1:8888/spicedl/downloadDir/set")
    }
    function resetDownloadDir(){
        fetch("http://127.0.0.1:8888/spicedl/downloadDir/reset")
    }

    downloadIcon='<svg viewBox="5 5 14 14" width="16" height="16" fill="currentcolor"><path d="M12 6.05a1 1 0 0 1 1 1v7.486l1.793-1.793a1 1 0 1 1 1.414 1.414L12 18.364l-4.207-4.207a1 1 0 1 1 1.414-1.414L11 14.536V7.05a1 1 0 0 1 1-1z"></path></svg>'

    //Append Menu Items
    new Spicetify.Menu.Item(
        "Downloads",
        true,
        ()=>Spicetify.PopupModal.display({ title: "Downloads", content: downloadList, isLarge: true }),
        downloadIcon
    ).register();

    new Spicetify.ContextMenu.Item(
    "Download",
    startDownload,
    ()=>true,
    downloadIcon
    ).register();

})();
