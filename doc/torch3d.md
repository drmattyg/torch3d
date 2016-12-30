# Writing Songbooks for the Torch Song 3D Simulator
*matt@hydrocarboncollective.org*

### About
The Torch 3D simulator lets you write programs (which we call *Songbooks*) for the [Torch Song](http://www.hydrocarboncollective.org/torch_song.html) kinetic fire art sculpture from the comfort of your own home.  We hope you'll write some great stuff and submit it to us to play on the sculpture at Burning Man, Maker Faire, or wherever else we wind up bringing it!  (Inquiries welcome).

Writing programs for the sculpture doesn't require that you know how to program, but it _does_ help to know about programming sturctures, like objects, maps, and lists.

This project is open source, and can be found here: https://github.com/drmattyg/torch3d

I encourage you to submit bugs and feature requests here: https://github.com/drmattyg/torch3d/issues

### Theory
Each edge of the double tetrahedron (the blue lines in the simulator) contains [a flame head on a shuttle that can run back and forth between the vertices](https://www.youtube.com/watch?v=4Nf6EaESeG8).  Programming the simulator entails instructing edge to move its shuttle at a particular speed, in a particular direction, either with or without the flame on.  In practice, instead of specifying an arbitrary speed, we specify a travel time, or how long we'd like for the shuttle to take to run from one end to another.  In the simulator, we can make this travel time as low as we'd like.  But in practice, **there is a lower limit set by how fast the shuttles can move**.  [This is about 3 seconds, or 3000 milliseconds](https://www.youtube.com/watch?v=NdVcWrVkcyE) (all times in the songbooks are specified in milliseconds).  Setting times lower than this can be useful for testing out ideas, to run them more quickly in the simulator, but 

This allows us to more easily sync the sculpture's movements with music.  We can optionally set the distance we'd like it to go as well.  Writing programs for the sculpture requires the user to keep track of where the shuttle is at any given moment; for instance, if we would like to move the Edge 1 shuttle from the upper vertex to the lower one, we must first ensure that the shuttle is actually _at_ the upper vertex to start.  We can do this by instructing the sculpture to move it there with the flame off.  In the examples, you'll see many instructions like this, that move shuttles with flames off, in order to pre-position them for their next movement with the flame on.

### Language Specifcation
Programs are written in [YAML](https://github.com/Animosity/CraftIRC/wiki/Complete-idiot's-introduction-to-yaml), aka "Yet Another Markup Language".  Each songbook consists of the following elements:

- *version*: A version number (*must be 1.0 currently*)
- *author*: An optional author name field
- *title*: An optional title field
- *songbook*: A list of commands

In the sample songbook, this looks like:
```
version: 1.0
author: matt@hydrocarboncollective.org
title: A Song for Diana
songbook:
```
After the songbook tag, a list of commands follows.  Each command is indendeted and starts with a dash (-) to indicate that it is a member of a list.  Let's look at a typical command:
```
  - start_at: 3000
    time: 3000
    edges:
      - edge: 0
        flame: 1
        dir: 1
      - edge: 6
        flame: 0
        dir: 0
```

Let's break this down:

- *start_at*: The time (in milliseconds) at which to start this command.  All start_at times are absolute, which is to say, this command will be executed 3000 milliseconds after the program is started.  Commands don't need to be in time order, and they can overlap in time, as long as overlapping commands don't use the same edge.
- *time*: this is the **travel time** of the shuttle from one end to another.  Shuttles will automatically stop at the end of their travel (in practice, this is accomplished through a limit switch on the shuttle carrier.)
- *edges*: a list of edges to control.

Each edge specficiation in turn contains the following commands:
- *edge*: the number of the edge to control (see the simulator for the edge numbers)
- *flame*: Whether the flame should be on or off.  1 = ON, 2 = OFF
- *dir*: The direction of travel.  1 is forward, -1 is reverse, 0 is no movement (the shuttle will remain stationary.)  "Forward" means from the reverse vertex towards the forward vertex; these are specified here: https://github.com/drmattyg/torch3d/blob/master/js/torchModel.js .  But, in practice, forward points upwards on edges 0 - 2 and 6 - 8, and clockwise on edges 3 - 5.  Shuttles always start their program at the reverse vertex (down, or counterclockwise.)
