

//function that tells whether the user can edit 
function canEdit(user, featureGeo) {

    //get the current Boundary the feature is created/updated on.
    var fsBoundary = FeatureSetByName($datastore, "restrictedits.owner.boundaryClass", ["globalId", "boundaryId"], false);
    var fsIntersectedBoundaries = Intersects(fsBoundary, featureGeo )
    //if no boundary error
    if (Count(fsIntersectedBoundaries) == 0)
    return {"errorMessage": "Features must be created within a boundary"} 
    
    //we are interested in the first boundary
    //we can enhnace the script to look for all boundaries
    var boundary = First(fsIntersectedBoundaries);
    var boundaryGlobalId = boundary.globalId;
    
    //query the usersBoundary class
    var usersBoundary = FeatureSetByName($datastore, "restrictedits.owner.usersBoundary"); 
    //is the user allowed to edit this boundary?
    var usercanEdit = Count(Filter(usersBoundary, "username = @user AND boundaryGuid = @boundaryGlobalId")) > 0 
    var boundaryId =  boundary.boundaryId
    //return a good error message
    return {
    "errorMessage": "User @user is unauthroized to edit Boundary @boundaryId",
    "success": usercanEdit
    }

   
}

//code starts here
//get the current user
var user = $feature.last_edited_user;
//get the feature geometry 
var featureGeo = Geometry($feature)
//if this was an update get the original geometry (user might have moved the feature)
//$originalFeature geometry is empty when creating new features
if (!isEmpty(Geometry($originalFeature)))
{
    //user is moving a feature, this is the original geometry
    var originalGeo  = Geometry($originalFeature)
    //is she allowed to do so? 
    var result = canEdit(user,originalGeo);
    if (result.success == false)
        return {"errorMessage": result.errorMessage}       
}


//is the user allowed to create/delete feature (or move a feature_
var result = canEdit(user,featureGeo);
if (result.success == false)
return {"errorMessage": result.errorMessage}       

//if we reach here we are good.
return true;
//update





