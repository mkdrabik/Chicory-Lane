<?php

//  role codes
define("ROLEEBIRD", "0");
define("ROLEPUBLIC", "1");
define("ROLEGUEST", "1");  
define("ROLEREGISTERED", "2");
define("ROLEAUTHORIZED", "3");
define("ROLECONTRIBUTOR", "4");
define("ROLEADMIN", "5");
define("ROLESYSTEM", "5");
define("ROLESUPER", "9");

//  role names
define("NAMEROLEEBIRD", "eBird Guest");
define("NAMEROLEGUEST", "Guest");
define("NAMEROLEPUBLIC", "Public");
define("NAMEROLEREGISTERED", "Registered User");
define("NAMEROLEAUTHORIZED", "Authorized User");
define("NAMEROLECONTRIBUTOR", "Contributor");
define("NAMEROLEADMIN", "Administrator");
define("NAMEROLESUPER", "SuperUser");

//  plant classes
define("HERBACEOUS", "1");
define("SHRUB", "2");
define("TREE", "3");
define("VINE", "4");
define("GRAMINOID", "5");


//  area names
define("AREANAMEHOUSEYARDBARN",	"House, Yard,  Barn");
define("AREANAMEGRASSLAND", 	"Grassland");
define("AREANAMEPOLLINATOR", 	"Pollinator Field");
define("AREANAMEWETMEADOW", 	"Wet Meadow");
define("AREANAMECATTAILMARSH", 	"Cattail Marsh");
define("AREANAMEPOND", 		"Farm Pond");
define("AREANAMEFRONTFIELD", 	"Front Field");
define("AREANAMEVERNALPOOLS",	"Vernal Pools");
define("AREANAMEFRONTMEADOW", 	"Front Meadow");
define("AREANAMEFORESTREMNANT", "Remnant Forest");
define("AREANAMEFORESTHILLSIDE","Wooded Hillside");
define("AREANAMEFORESTUPTOP", 	"Forest Up Top");
define("AREANAMERIPARIANNORTH", "Riparian - North");
define("AREANAMERIPARIANSOUTH", "Riparian - South");
define("AREANAMERIPARIANEAST", 	"Riparian - East");
define("AREANAMEFARM", 		"Whole Farm");
define("AREANAMESKY", 		"Sky");

//  area codes
define("AREAHOUSEYARDBARN",	"0");
define("AREAGRASSLAND", 	"1");
define("AREAPOLLINATOR", 	"2");
define("AREAWETMEADOW", 	"3");
define("AREACATTAILMARSH", 	"4");
define("AREAPOND", 		"5");
define("AREAFRONTFIELD", 	"6");
define("AREAVERNALPOOLS", 	"7");
define("AREAFRONTMEADOW", 	"8");
define("AREAFORESTREMNANT", 	"9");
define("AREAFORESTHILLSIDE",	"10");
define("AREAFORESTUPTOP", 	"11");
define("AREARIPARIANNORTH", 	"12");
define("AREARIPARIANSOUTH", 	"13");
define("AREARIPARIANEAST", 	"14");
define("AREAFARM", 		"15");
define("AREASKY", 		"16");

//  area latitudes
define("AREALATHOUSEYARDBARN",	"40.876298");
define("AREALATGRASSLAND", 	"40.877430");
define("AREALATPOLLINATOR", 	"40.876426");
define("AREALATWETMEADOW", 	"40.877196");
define("AREALATCATTAILMARSH", 	"40.877182");
define("AREALATPOND", 		"40.876113");
define("AREALATFRONTFIELD", 	"40.875628");
define("AREALATVERNALPOOLS",	"40.875078");
define("AREALATFRONTMEADOW", 	"40.874790");
define("AREALATFORESTREMNANT", 	"40.876407");
define("AREALATFORESTHILLSIDE",	"40.875093");
define("AREALATFORESTUPTOP", 	"40.874784");
define("AREALATRIPARIANNORTH", 	"40.876485");
define("AREALATRIPARIANSOUTH", 	"40.874600");
define("AREALATRIPARIANEAST", 	"40.876089");
define("AREALATFARM", 		"40.876298");  //  hyb - center
define("AREALATSKY", 		"40.876298");  //  hyb - center
define("AREALATDEFAULT", 	"40.876298");  //  hyb - center

//  area longitudes
define("AREALNGHOUSEYARDBARN",	"-77.547128");
define("AREALNGGRASSLAND", 	"-77.545998");
define("AREALNGPOLLINATOR", 	"-77.546055");
define("AREALNGWETMEADOW", 	"-77.548288");
define("AREALNGCATTAILMARSH", 	"-77.548873");
define("AREALNGPOND", 		"-77.549546");
define("AREALNGFRONTFIELD", 	"-77.550620");
define("AREALNGVERNALPOOLS",	"-77.550175");
define("AREALNGFRONTMEADOW", 	"-77.549608");
define("AREALNGFORESTREMNANT", 	"-77.544460");
define("AREALNGFORESTHILLSIDE",	"-77.547995");
define("AREALNGFORESTUPTOP", 	"-77.546247");
define("AREALNGRIPARIANNORTH", 	"-77.548845");
define("AREALNGRIPARIANSOUTH", 	"-77.548845");
define("AREALNGRIPARIANEAST", 	"-77.546317");
define("AREALNGFARM", 		"-77.547128");  //  hyb - center
define("AREALNGSKY", 		"-77.547128");  //  hyb - center
define("AREALNGDEFAULT", 	"-77.547128");  //  hyb - center

//  lat/lng direction 	
define ("LATLNGDIRECTIONN",	"0");
define ("LATLNGDIRECTIONNE",	"1");
define ("LATLNGDIRECTIONE",	"2");
define ("LATLNGDIRECTIONSE",	"3");
define ("LATLNGDIRECTIONS",	"4");
define ("LATLNGDIRECTIONSW",	"5");
define ("LATLNGDIRECTIONW",	"6");
define ("LATLNGDIRECTIONNW",	"7");

//  latitude direction scale values
define ("SCALELATN",1.0);
define ("SCALELATNE",0.707);
define ("SCALELATE",0.0);
define ("SCALELATSE",-0.707);
define ("SCALELATS",-1.0);
define ("SCALELATSW",-0.707);
define ("SCALELATW",0.0);
define ("SCALELATNW",0.707);

//  longitude direction scale values
define ("SCALELNGN", 0.0);  
define ("SCALELNGNE", 0.707);  //  since lng at cl is negative, positive increment moves point east
define ("SCALELNGE", 1.0);
define ("SCALELNGSE",0.707);
define ("SCALELNGS", 0.0);
define ("SCALELNGSW", -0.707);
define ("SCALELNGW", -1.0);
define ("SCALELNGNW", -0.707);

//  latitude distance scale values
define ("SCALELATDISTYD", 0.000010);
define ("SCALELATDISTFT", 0.0000036);

//  longitude distance scale values
define ("SCALELNGDISTYD", 0.000010);
define ("SCALELNGDISTFT", 0.0000033);


//  latitude distance scale value in degrees/foot
define ("SCALELATDISTANCE", 0.0000033); // (0.878970 - 0.874790 )/1259.82)

//  longitude distance scale value in degrees/foot
define ("SCALELNGDISTANCE", 0.0000044);  // (0.551903 - 0.546617)/1196.64)


//  plant community names
define("COMMNAMEYARD", "Landscaped Yard");
define("COMMNAMEGRASSLAND", "Mesic Grassland");
define("COMMNAMEPOLLINATOR", "Pollinator");
define("COMMNAMEWETMEADOW", "Wet Meadow");
define("COMMNAMECATTAILMARSH", "Cattail Marsh");
define("COMMNAMEPOND", "Farm Pond");
define("COMMNAMEPALUSTRINEWOODLAND", "Palustrine Woodland");
define("COMMNAMEVERNALPOOL", "Vernal Pool");
define("COMMNAMEHEMLOCKREDOAKFOREST", "Hemlock - Red Oak Forest");
define("COMMNAMESUCCESSIONALFOREST", "Successional Forest");
define("COMMNAMEREDOAKMIXEDHARDWOODFOREST", "Red Oak - Mixed Hardwood Forest");
define("COMMNAMERIPARIAN", "Riparian");

//  plant community codes
define("COMMYARD", 			"0");
define("COMMGRASSLAND", 		"1");
define("COMMPOLLINATOR", 		"2");
define("COMMWETMEADOW", 		"3");
define("COMMCATTAILMARSH", 		"4");
define("COMMPOND", 			"5");
define("COMMPALUSTRINEWOODLAND", 	"6");
define("COMMVERNALPOOL", 		"7");
define("COMMHEMLOCKREDOAKFOREST", 	"8");
define("COMMSUCCESSIONALFOREST", 	"9");
define("COMMREDOAKMIXEDHARDWOODFOREST",	"10");
define("COMMRIPARIAN", 			"11");

//  media file constants
define("PROJECTPATHTOROOT", "/database/data/MediaFiles/");
define("MEDIAROOTNAME", "root");
define("MEDIASMALLROOTNAME", "rootSmall");
define("IMAGEFILEMODULUS", 64);
define("UPLOADFILENAME", "uploadFile");

//  date constants
define("YEARCURRENT", "2016");

//  bird constants
define("BIRDGUIDE", "https://www.allaboutbirds.org/guide/");
define("BIRDSPACECHAR", "_");

//  plant constants
define("PLANTGUIDE", "http://explorer.natureserve.org/servlet/NatureServe?searchName=");
define("PLANTSPACECHAR", "+");

?>