import * as fp from "fingerpose";

export const VictoryGesture = new fp.GestureDescription("victory");

VictoryGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
VictoryGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);

VictoryGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
VictoryGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
VictoryGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 0.9);
