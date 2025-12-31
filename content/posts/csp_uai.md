---
title: Systolic Array Architectures
date: 2025-12-30
author: Nolen Zhao
tags: [Coding, Concurrency, Academic]
---

# Non-Neumann Architectures
In reading Tony Hoare's [^1] seminal paper on message passing ["Communicating Sequential Processes,"](https://www.cs.cmu.edu/~crary/819-f09/Hoare78.pdf) I read over the implementation of matrix multiplication he constructs. The message passing interface in general had already reminded me of dataflow architectures, but in reading this section, I was immediately reminded of the the way streaming on AI accelerators works. Seen below is the figure from Hoare's paper.

![Hoare's Impl](../figures/systolic_arr.png)

Hoare's figure is in essence a systolic array, a type of hardware architecture which contains a grid of processing elements (PE's). They
pump input data to be computed through fixed data in hardware much like a heart 
pumps blood (hence systolic). For example, [Untether AI's architecture](https://www.untether.ai/products/#lead-content-2) , seen below, is naturally able to emulate this systolic nature (programmable through software). At each step, the input data performs some computation at each PE, for example, multiplication with the local data in SRAM. The result can then be routed east or west to continue computation. By streaming through the processor, data (model weights in the case of UAI) in SRAM is accessed without the overhead of load/store in von-Neumann architectures.

![UAI](../figures/uai_pes.png)

The formalization of this concept by Hoare was interesting to me, and he shows how input/output in actually a primitive in concurrent programs. The paper uses it to construct bounded buffers, monitors, and other objects. Channels in Golang use this message passing as their basis. 

I'm curious what concepts from message passing will apply to my upcoming work at Tenstorrent on their fabric interconnect, given it's possible systolic similarities. Perhaps some of Hoare's other works contains deadlock prevention in message passing and other techniques for rendezvous which are asynchronous (as compared to the synchronous handoff form the paper). I may possibly update this with messaging's implications in distributed systems.


[^1]: 
    Creator of quicksort algorithm, and integral contributor to concurrent programming, working closely with Dijkstra. Proposed the titular Hoare semantics (as opposed to Mesa semantics) in monitor signalling. I like Hoare semantics better.

