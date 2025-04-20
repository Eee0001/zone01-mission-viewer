# Zone01 Mission Viewer
Mission viewer is a tool that helps with planning robot routes for Zone01 missions.

## Using the map
- Place points on the map by clicking.
- Move the points by dragging or with the arrow keys.

* Use menu to import/export route and points.

## Decoding the route
When exporting the route from mission viewer you will get something like this:
```
-1
-1
1
445
0
-1
-90
1
495
0
```
Each movement is split into 5 parts like this:
```
Turn direction (-1 = left, 1 = right)
Turn angle     (-180 to 180)
Direction      (1 = forwards, -1 = backwards)
Distance       (in milimetres)
Function       (ex: lift arm before moving)
```
The previous example moves forwards for 445mm at 0deg turns left and moves forwards for 495 at -90deg.

## Keyboard Shortcuts
* Delete points with **backspace**.
* Restore points with **enter**.

-  Clear the route with **q**.
-  Load save with **p**.

* Toggle robot overlay with **o**.
* Toggle point information with **i**.

- Set point to forwards with **+**.
- Set point to backwards with **-**.

* Set point function with **numbers**.
