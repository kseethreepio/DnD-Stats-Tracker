var myDataRef = new Firebase("https://shining-torch-7755.firebaseio.com");

// Load footer (async)
jQuery("#footer-2016").load("footer.html");

// Main DOM events go here
jQuery(document).on("ready", function() {

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

    if (window.location.pathname === "/campaignList.html") {
        sSelectedCampaignName = "testCampaignFake";
        
        $("#btnSaveCampaignName").click(function (e) {
            sCampaignName = $("#campaignName-text").val();   // TODO: Scrub input string
            sSelectedCampaignName = sCampaignName;
            sReducedCampaignName = ((sCampaignName.toLowerCase()).replace(/\s/g, "")).substring(0, 10)   // For consistency with session "id"...
            jCampaignInfo = {
                "id": sReducedCampaignName,
                "name": sCampaignName
            };
            
            baseDataRef.child(sReducedCampaignName).update(jCampaignInfo);
        });
        
        $("#btnGoHome").click(function (e) {
            window.location = "/";
        });
        
        $("#btnChooseCampaign").click(function (e) {
            
            window.location = "sessionList.html?campName=" + sReducedCampaignName;
        });
    }

});