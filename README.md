# physics-engine

Physics engine library built with TypeScript that is designed for basic physics simulations on your web application. 

## Features

This physics engine uses an HTML `<canvas>` element as the rendering surface, with the Canvas 2D API as the renderer.

- **Collision detection** is seperated in to **broad-phase** and **narrow-phase** detection: <br> **Broad-phase collision detection** utilizes quadtree data structure to create a dynamic collision grid at run-time, preventing unnecessary collision checks and thus optimizing the overall performance of the physics simulations. <br> ![Broad-phase](images/presentation2.gif)<br> **Narrow-phase collision detection** uses Seperating Axis Theorem to create an algorithm which determines whether two convex shapes are intersecting or overlapping <br> ![Narrow-phase](images/presentation.gif)

- **Collision resolution** is integrated via impulse-based reaction model method, widely used by most game physics. It can solve both rotational and linear motion collisions.

- **Dynamics** are handled by Velocity Verlet integration to create realistic motion and response to forces.

- Currently, the library supports only convex shapes and circles for **Rigid  bodies**.
