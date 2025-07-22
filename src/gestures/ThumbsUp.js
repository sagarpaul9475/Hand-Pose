import * as fp from "fingerpose";

export const ThumbsUpGesture = new fp.GestureDescription("thumbs_up");

// Thumb
ThumbsUpGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
ThumbsUpGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalUp, 1.0);

// All other fingers curled
for (let finger of [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
  ThumbsUpGesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
}
