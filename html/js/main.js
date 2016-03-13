var myDataRef = new Firebase("https://shining-torch-7755.firebaseio.com");

// Load footer (async)
jQuery("#footer-2016").load("footer.html");

// Main DOM events go here
jQuery(document).on("ready", function() {

    /* Login, logout, and signed-in user info */

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
            var row = document.createElement("tr");
            var cellMetadata = document.createElement("td");  // Campaign metadata
            var campName = document.createElement("span");  // Holds campaign name
            var gameSystem = document.createElement("span");  // Label for above td
            var cellSelectBtn = document.createElement("td");  // To load campaign details
            var campButton = document.createElement("button");  // Button for above td
            var pageBreak = document.createElement("br");

            // Setting attributes on elemenets
            row.setAttribute("class", "plain");
            cellMetadata.setAttribute("class", "campMetadata padded");
            campName.setAttribute("class", "campName");
            gameSystem.setAttribute("class", "label label-default");
            cellSelectBtn.setAttribute("class", "campMoreInfoBtn padded");
            campButton.setAttribute("type", "button");
            campButton.setAttribute("class", "btn btn-s btn-primary");
            campButton.innerText = "Choose this campaign";

            // Setting up hierarchy of elements
            cellMetadata.appendChild(campName);
            cellMetadata.appendChild(pageBreak);
            cellMetadata.appendChild(gameSystem);

            cellSelectBtn.appendChild(campButton);

            row.appendChild(cellMetadata);
            row.appendChild(cellSelectBtn);

            // In the end, just need the tr (and its children)
            return row;
        }

        function createCampaignEntry(campaignName, rulesSystem) {
            var campaignEntry = createEmptyCampaignEntryTemplate();

            // Select first td, to retrieve campgain metadata
            var campMetadata = campaignEntry.getElementsByTagName("td")[0];

            campMetadata.querySelector("span.campName").innerText = campaignName;
            campMetadata.querySelector("span.label-default").innerText = rulesSystem;

            return campaignEntry;
        }


        // Loop through each campaign entry in db
        var campaignsDataRef = new Firebase("https://shining-torch-7755.firebaseio.com/data/campaigns");

        campaignsDataRef.on("value", function(snapshot) {

            var dataSnapshot = snapshot.val();

            for (item in dataSnapshot) {
                var selectedCampaignName   = dataSnapshot[item].name;
                var selectedCampaignSystem = dataSnapshot[item].system;
                var selectedCampaignId     = dataSnapshot[item].id;
                var newEntryForCampaign    = createCampaignEntry(selectedCampaignName, selectedCampaignSystem);

                newEntryForCampaign.querySelector("button.btn-primary").setAttribute("id", selectedCampaignId);
                document.getElementById("tblCampList").appendChild(newEntryForCampaign);
            }

        }, function(errorObject) {
            console.log("ERROR: Failed to read DB: " + errorObject.code);
        });

    }

    /* Navigation */
    $("#btnGoHome").click(function (e) {
        window.location = "/";
    });

});