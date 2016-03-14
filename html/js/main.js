var myDataRef = new Firebase("https://shining-torch-7755.firebaseio.com");

// Load footer (async)
jQuery("#footer-2016").load("footer.html");

// Main DOM events go here
jQuery(document).on("ready", function() {

    /* Variables and helpers used across pages */

    // Regex used for reducing down text to query param-friendly strings
    regexQueryParamText = /[^\w]/g;

    // Login, logout, and signed-in user info
    (function fixUpHeaderUI() {
        var currentAuthData = myDataRef.getAuth();
        if (currentAuthData) {
            // Leave header in default state, which is to upsell sign out action. But update span w/username.
            document.getElementById("spanUsername").textContent = currentAuthData.google.displayName;
        } else {
            window.location.pathname = "/"
        }
    })();

    jQuery(document).on("mousedown", "#linkSignout", function() {
        console.log("Signing out...");
        myDataRef.unauth();
        window.location.pathname = "/";
    });

    /* Campaign page functions */

    if (window.location.pathname === "/campaignList.html") {

        // Template for a single row in the campaign list
        function createEmptyCampaignEntryTemplate() {
            var row            = document.createElement("tr");
            var cellMetadata   = document.createElement("td");  // Campaign metadata
            var campName       = document.createElement("span");  // Holds campaign name
            var gameSystem     = document.createElement("span");  // Label for above td
            var cellSelectBtn  = document.createElement("td");  // To load campaign details
            var campButton     = document.createElement("button");  // Button for above td
            var campButtonLink = document.createElement("a");  // Link for above button
            var pageBreak      = document.createElement("br");

            // Setting attributes on elemenets
            row.setAttribute("class", "plain");
            cellMetadata.setAttribute("class", "campMetadata padded");
            campName.setAttribute("class", "campName");
            gameSystem.setAttribute("class", "label label-default");
            cellSelectBtn.setAttribute("class", "campMoreInfoBtn padded");
            campButtonLink.setAttribute("class", "campButtonLink");
            campButton.setAttribute("type", "button");
            campButton.setAttribute("class", "btn btn-s btn-primary");
            campButton.innerText = "Choose this campaign";

            // Setting up hierarchy of elements
            cellMetadata.appendChild(campName);
            cellMetadata.appendChild(pageBreak);
            cellMetadata.appendChild(gameSystem);

            cellSelectBtn.appendChild(campButtonLink);
            campButtonLink.appendChild(campButton);

            row.appendChild(cellMetadata);
            row.appendChild(cellSelectBtn);

            // In the end, just need the tr (and its children)
            return row;
        }

        function createCampaignEntry(campaignName, rulesSystem, campaignId) {
            var campaignEntry = createEmptyCampaignEntryTemplate();

            // Select first td, to retrieve campgain metadata
            var campMetadata = campaignEntry.getElementsByTagName("td")[0];
            campMetadata.querySelector("span.campName").innerText = campaignName;
            campMetadata.querySelector("span.label-default").innerText = rulesSystem;

            // Seelct second td, to set the link and id for the campaign selection button
            var campButton = campaignEntry.getElementsByTagName("td")[1];
            campButton.querySelector("a.campButtonLink").setAttribute("href", "sessionList.html?campaignId=" + campaignId);
            campButton.querySelector("button.btn-primary").setAttribute("id", campaignId);

            return campaignEntry;
        }


        // Loop through each campaign entry in db
        var campaignsDataRef = new Firebase("https://shining-torch-7755.firebaseio.com/data/campaigns");

        campaignsDataRef.on("value", function(snapshot) {

            var dataSnapshot = snapshot.val();
            var tableCampaignList = document.getElementById("tblCampList");

            // Would be better to search list to avoid duplicate elements, but tables
            // shouldn't ever be too large, so rebuilding isn't the end of the world.
            while (tableCampaignList.hasChildNodes()) {
                tableCampaignList.removeChild(tableCampaignList.childNodes[0]);
            }

            for (item in dataSnapshot) {
                var selectedCampaignName   = dataSnapshot[item].name;
                var selectedCampaignSystem = dataSnapshot[item].system;
                var selectedCampaignId     = dataSnapshot[item].id;
                var newEntryForCampaign    = createCampaignEntry(selectedCampaignName, selectedCampaignSystem, selectedCampaignId);

                tableCampaignList.appendChild(newEntryForCampaign);
            }

        }, function(errorObject) {
            console.log("ERROR: Failed to read DB campaigns: " + errorObject.code);
        });

        // Save new campaigns to db
        jQuery(document).on("click", "#btnSaveCampaignName", function() {
            var newCampaign = new Object();
            var enteredName = document.getElementById("campaignName").value;
            var enteredSystem = document.getElementById("campaignSystem").value;
            var newCampaignId = enteredName.replace(regexQueryParamText, "").slice(0, 4) + new Date().getTime().toString();

            campaignsDataRef.push({
                "id": newCampaignId,
                "name": enteredName,
                "system": enteredSystem
            });
        });

    }

    if (window.location.pathname === "/sessionList.html" && window.location.search === "") {
        document.getElementById("noCampaignChosen").removeAttribute("hidden");
        document.getElementById("tblSessionList").setAttribute("hidden", "true");
        document.getElementById("btnAddSession").setAttribute("style", "display: none");
    }

    if (window.location.pathname === "/sessionList.html" && window.location.search !== "") {

        // Template for a single row in the campaign list
        function createEmptySessionEntryTemplate() {
            var row              = document.createElement("tr");
            var cellSessMetadata = document.createElement("td");  // Session name
            var sessName         = document.createElement("span");
            var sessPCs          = document.createElement("span");
            var cellSelectBtn    = document.createElement("td");  // To load session details
            var sessButton       = document.createElement("button");  // Button for above td
            var sessButtonLink   = document.createElement("a");  // Link for above button
            var pageBreak        = document.createElement("br");

            // Setting attributes on elemenets
            row.setAttribute("class", "plain");
            cellSessMetadata.setAttribute("class", "sessMetadata padded");
            sessName.setAttribute("class", "sessName");
            sessPCs.setAttribute("class", "sessPCs");
            cellSelectBtn.setAttribute("class", "sessStatsBtn padded");
            sessButtonLink.setAttribute("class", "sessButtonLink");
            sessButton.setAttribute("type", "button");
            sessButton.setAttribute("class", "btn btn-xs btn-default");
            sessButton.innerText = "View session's stats";

            // Setting up hierarchy of elements
            cellSessMetadata.appendChild(sessName);
            cellSessMetadata.appendChild(pageBreak);
            cellSessMetadata.appendChild(sessPCs);

            cellSelectBtn.appendChild(sessButtonLink);
            sessButtonLink.appendChild(sessButton);

            row.appendChild(cellSessMetadata);
            row.appendChild(cellSelectBtn);

            // In the end, just need the tr (and its children)
            return row;
        }

        function createSessionEntry(sessionName, sessionId, pcNames) {
            var sessionEntry = createEmptySessionEntryTemplate();

            // Set session name
            sessionEntry.querySelector("td.sessMetadata > span.sessName").innerText = sessionName;
            sessionEntry.querySelector("td.sessMetadata > span.sessPCs").innerText = "Players: " + pcNames;
            sessionEntry.querySelector("td.sessStatsBtn > a").setAttribute("href", "sessionStats.html?sessionId=" + sessionId);
            sessionEntry.querySelector("td.sessStatsBtn > a > button").setAttribute("id", sessionId);

            return sessionEntry;
        }

        // Loop through each session entry in db
        var sessionsDataRef = new Firebase("https://shining-torch-7755.firebaseio.com/data/sessions");

        sessionsDataRef.on("value", function(snapshot) {

            var dataSnapshot     = snapshot.val();
            var tableSessionList = document.getElementById("tblSessionList");
            var numFoundSessions = 0;

            // Unhiding table after user created the first session for campaign
            if (document.getElementById("tblSessionList").getAttribute("style") === "display: none") {
                document.getElementById("tblSessionList").removeAttribute("style");
                document.getElementById("btnAddSession").removeAttribute("style");
                document.getElementById("noSessionsInCampaign").setAttribute("hidden", "true");
            }

            // Would be better to search list to avoid duplicate elements, but tables
            // shouldn't ever be too large, so rebuilding isn't the end of the world.
            while (tableSessionList.hasChildNodes()) {
                tableSessionList.removeChild(tblSessionList.childNodes[0]);
            }

            for (item in dataSnapshot) {
                var selectedSessionId       = dataSnapshot[item].id;
                var selectedSessionName     = dataSnapshot[item].name;
                var selectedSessionPlayers  = dataSnapshot[item].players;
                
                // Show session in list if parentCampaign matches query param in URL
                if (dataSnapshot[item].parentCampaign === window.location.search.split("=")[1]) {
                    tableSessionList.appendChild(createSessionEntry(selectedSessionName, selectedSessionId, selectedSessionPlayers));
                    numFoundSessions++;
                }
            }

            if (numFoundSessions == 0) {
                document.getElementById("tblSessionList").setAttribute("style", "display: none");
                document.getElementById("btnAddSession").setAttribute("style", "display: none");
                document.getElementById("noSessionsInCampaign").removeAttribute("hidden");
            }

        }, function(errorObject) {
            console.log("ERROR: Failed to read DB for sessions: " + errorObject.code);
        });

        // Save new sessions to db
        jQuery(document).on("click", "#btnSaveSession", function() {
            var newSession     = new Object();
            var enteredName    = document.getElementById("sessionName").value;
            var enteredPCNames = document.getElementById("pcNames").value.replace(/\s*,\s*/g, ", ");
            var newSessionId   = enteredName.replace(regexQueryParamText, "").slice(0, 4) + new Date().getTime().toString();

            sessionsDataRef.push({
                "id": newSessionId,
                "name": enteredName,
                "parentCampaign": window.location.search.split("=")[1],  // Get query param value
                "players": enteredPCNames
            });
        });

    }

});