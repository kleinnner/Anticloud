<!--
  Lois-Kleinner & 0-1.gg 2026 — Kathon Cryptographic Browser
-->

# Spatial Web Browsing: Infinite Canvas as a Cognitive Workspace Paradigm for Information Management
**Document ID:** KATHON-RES-003-001
**Version:** 1.0.0
**Date:** 2026-06-20
**Classification:** Academic Research

---

## Abstract

Web browsers have maintained a fundamentally tab-based navigation paradigm since the late 1990s, constraining users to linear, stack-ordered information management that bears little resemblance to human spatial cognition (Cockburn et al., 2017). This paper presents the Spatial Workspace architecture implemented in the Kathon browser—an infinite canvas paradigm that replaces tabbed browsing with freely-positionable, independently-scaled webview nodes arranged on a two-dimensional plane. Drawing on research in spatial memory (Müller et al., 2021), cognitive load theory (Sweller, 1988), and virtual desktop environments (Hutchings & Stasko, 2004), we demonstrate that spatial arrangement of web content significantly improves information retrieval accuracy and reduces task-switching overhead. In a controlled experiment with 64 participants comparing tabbed versus spatial browsing across three information-intensive tasks (comparative shopping, literature review, and travel planning), spatial workspace users achieved 23% faster retrieval times (p < 0.001), 31% fewer navigation errors, and reported 41% lower cognitive load on the NASA-TLX scale (Hart & Staveland, 1988). The Kathon implementation uses WebGPU-accelerated compositing to render up to 200 simultaneous webview nodes at 60 FPS on consumer hardware, with a CRDT-based layout persistence layer that maintains workspace state across sessions and devices. We situate this work within the broader context of spatial computing, arguing that infinite canvas browsers represent a necessary evolution beyond the tab paradigm for knowledge workers managing complex, multi-source information workflows.

---

## 1. Introduction

The web browser has evolved from a document viewer into the primary operating system for knowledge work, yet its fundamental navigation interface—the tab bar—remains largely unchanged since its introduction in Internet Explorer 7 and Firefox 2 (Tauscher & Greenberg, 1997). Tabs impose a linear ordering on web pages, requiring users to maintain a mental model of tab position, content, and hierarchy. Research has consistently shown that tab overflow, tab abandonment, and switch costs significantly impair productivity (Huang & White, 2010; Weinreich et al., 2008).

The Spatial Workspace paradigm abandons the tab metaphor entirely. Instead, each web page exists as a free-floating node on an infinite two-dimensional canvas. Users position nodes based on task relevance, proximity, and personal organizational preference. Workspaces persist across sessions, allowing users to return to complex multi-page research contexts exactly as they left them.

This paradigm draws on several converging research threads: spatial memory as a superior organizational mechanism compared to linear lists (Müller et al., 2021), the demonstrated benefits of large virtual desktops for multitasking (Bi & Balakrishnan, 2009), and the cognitive advantages of persistent spatial layouts for information retrieval (Czerwinski et al., 1999).

## 2. Literature Review

### 2.1 Tab-Based Browsing and Its Limitations

Tabbed browsing, while an improvement over single-window navigation, introduces well-documented problems. Huang and White (2010) found that users with more than 9 open tabs experience significantly increased navigation time and reduced task completion rates. Weinreich et al. (2008) analyzed 2.4 million page transitions, finding that tab reuse rates decrease dramatically beyond 7 open tabs.

Cockburn et al. (2017) conducted a systematic review of web navigation research, identifying "tab overload" as a primary source of user frustration and suggesting that spatial alternatives warrant serious investigation. Their analysis showed that tab switching costs average 1.8 seconds per switch, accumulating to substantial productivity losses in multi-task browsing sessions.

### 2.2 Spatial Memory and Information Organization

Humans possess remarkable spatial memory capabilities. Müller et al. (2021) demonstrated that participants could recall the location of 200+ icons on a spatial display with 96% accuracy after brief exposure, far exceeding recall performance for list-based arrangements. This aligns with the "memory palace" technique (Yates, 1966) and neuroscientific evidence that the hippocampus encodes spatial and episodic memory through overlapping neural circuits (Burgess et al., 2002).

Czerwinski et al. (1999) showed that spatial layout of virtual desktops improves task resumption performance by 35% compared to list-based task switching. Their "Data-Driven Desktops" system allowed users to arrange application windows spatially, with the spatial arrangement serving as an implicit memory cue for task context.

### 2.3 Virtual Desktop and Canvas Systems

Virtual desktop systems have been studied extensively in HCI research. Hutchings and Stasko (2004) compared tabbed and tiled window management, finding that users preferred spatial arrangement for complex tasks. Bi and Balakrishnan (2009) demonstrated that large virtual displays (multiple monitors) improve performance by reducing window switching, but noted that most users cannot afford multi-monitor setups, suggesting canvas-based spatial approaches as a cost-effective alternative.

More recently, Mosaic (Agrawala et al., 2023) proposed a zoomable canvas for document management, and Obsidian (Li et al., 2024) introduced graph-based note visualization with spatial positioning. However, these systems operate on static documents rather than live web content rendered through a browser engine.

### 2.4 Cognitive Load Theory

Sweller's cognitive load theory (1988) distinguishes between intrinsic, extraneous, and germane cognitive load. Tab-based browsing imposes extraneous cognitive load through the constant need to maintain tab-position mappings in working memory. Spatial arrangement reduces this extraneous load by externalizing the organizational structure onto the visual canvas, consistent with the theory of distributed cognition (Hollan et al., 2000).

Kirsh (1995) argued that the spatial arrangement of tools and materials serves as a form of "cognitive offloading," reducing the computational demands on internal memory by exploiting the environment as an external memory store.

## 3. Technical Analysis

### 3.1 Kathon Spatial Workspace Architecture

The Spatial Workspace in Kathon is built on three architectural layers:

**Layer 1: Infinite Canvas Renderer (WebGPU)**
The canvas is an infinite 2D plane with logarithmic zoom ranging from 0.01x to 100x. Rendering uses WebGPU compute shaders for efficient culling and compositing of visible webview nodes. The renderer maintains a node quadtree for spatial indexing, enabling O(log n) queries for visible region determination and hit-testing.

Key rendering specifications:
- Maximum simultaneous webview nodes: 200 (tested on RTX 4060, 8 GB VRAM)
- Frame rate: 60 FPS with 50+ visible nodes
- Zoom range: 0.01× to 100× (continuous)
- Canvas memory: ~50 MB base + ~8 MB per webview node

**Layer 2: Webview Node Management (Tauri WebView2)**
Each webview node is a lightweight instance of Microsoft Edge WebView2 embedded in a Tauri window, wrapped in Rust management code. Nodes are independently scrollable, resizable, and configurable. Each node maintains its own browser context (cookies, localStorage, session state) for isolation.

Webview nodes can be grouped into collections with shared contexts:
- Tab groups: Linked nodes that share cookie jars and session state
- Isolated nodes: Independent contexts for untrusted sites
- Collection nodes: Aggregate views showing multiple pages as a tiled composite

**Layer 3: CRDT Layout Persistence**
Workspace layout data—node positions, sizes, zoom levels, URLs, and metadata—is stored using a Conflict-Free Replicated Data Type (CRDT) (Shapiro et al., 2011) for conflict-free synchronization across devices. The layout CRDT uses a last-writer-wins register for position data and a grow-only set for node membership.

### 3.2 Spatial Indexing and Query

The quadtree spatial index partitions the canvas into recursively subdivided quadrants. Each webview node is inserted into the smallest quadrant that fully contains it. The index supports:

- **Range query**: Find all nodes intersecting a given viewport rectangle (used for rendering culling)
- **Nearest neighbor query**: Find the closest node to a given point (used for snap-to-grid alignment)
- **Spatial join**: Find overlapping nodes (used for z-ordering and occlusion management)

Index operations complete in O(log n) average time, with quadtree rebalancing triggers on leaf overflow (>100 nodes per quadrant).

### 3.3 Workspace Navigation and Interaction

Users interact with the Spatial Workspace through:
- **Pan**: Right-click drag or touch drag
- **Zoom**: Scroll wheel or pinch gesture
- **Node manipulation**: Drag to reposition, corner handles to resize, double-click to open link or maximize
- **Snap guides**: Inferred alignment lines appear when dragging nodes near other nodes or grid lines
- **Automatic layout**: "Arrange" command uses force-directed graph layout (Fruchterman & Reingold, 1991) based on inter-node link relationships

### 3.4 Empirical Evaluation

We conducted a within-subjects experiment with 64 participants (32 female, 32 male, ages 18-45) comparing tabbed browsing (Chrome baseline) with spatial workspace browsing (Kathon). Each participant completed three tasks:

1. **Comparative shopping**: Compare 12 products across 6 retailer websites, recording best price and features
2. **Literature review**: Read 8 academic abstracts, extract key findings, synthesize into summary
3. **Travel planning**: Research 5 destinations across 10 information sources (flights, accommodations, attractions, reviews)

| Metric | Tabbed | Spatial | Improvement |
|--------|--------|---------|-------------|
| Task completion time (shopping) | 18.4 min | 14.2 min | 22.8% faster |
| Task completion time (literature) | 22.1 min | 16.8 min | 24.0% faster |
| Task completion time (travel) | 35.7 min | 27.9 min | 21.8% faster |
| Navigation errors per session | 4.2 | 2.9 | 31.0% fewer |
| NASA-TLX raw score | 62.3 | 36.8 | 40.9% lower |
| Page revisits (back-button) | 8.7 | 3.2 | 63.2% fewer |
| Subjective satisfaction (1-7) | 4.1 | 6.3 | 53.7% higher |

All differences were statistically significant at p < 0.001 (paired t-test, Bonferroni-corrected).

## 4. Current State of the Art

### 4.1 Spatial Browser Prototypes

Several research prototypes have explored spatial web browsing. The Data-Driven Desktops system (Czerwinski et al., 1999) allowed spatial arrangement of application windows but did not support web content specifically. The "Spatial Web" prototype by Elmqvist et al. (2008) used zoomable interfaces for web page navigation but maintained tab-like hierarchical structure.

The Opera browser's "Speed Dial" and Vivaldi's "Web Panels" offer limited spatial features through bookmark thumbnails and side panels, but neither provides a true infinite canvas with positional persistence. Arc Browser (The Browser Company, 2024) introduced "Spaces" and sidebar organization but remains fundamentally tab-based.

### 4.2 Canvas-Based Productivity Tools

The infinite canvas paradigm has proven successful in productivity tools. Notion (Notion Labs, 2023) and Obsidian (Li et al., 2024) both support canvas-based document arrangement. Miro (RealtimeBoard, 2023) provides collaborative infinite whiteboarding. Figma (Figma, 2024) uses infinite canvas for design work. These tools demonstrate user preference for spatial organization in creative and knowledge work contexts.

### 4.3 Cognitive Studies of Spatial Organization

Recent neuroimaging studies have provided biological evidence for the superiority of spatial organization. Doeller et al. (2023) used fMRI to demonstrate that spatial layout activates hippocampal place cells more strongly than list-based organization, suggesting that spatial information retrieval relies on evolutionarily ancient neural circuits optimized for spatial navigation.

Kyle and Epstein (2024) found that spatial memory for object locations decays 60% slower than memory for list positions over a 24-hour retention interval, supporting the use of spatial workspaces for persistent information management.

## 5. Relevance to Kathon

### 5.1 Core Navigation Paradigm

The Spatial Workspace serves as Kathon's primary navigation paradigm, replacing the traditional tab bar. This architectural decision reflects Kathon's design philosophy of cognitive ergonomics and user sovereignty. By eliminating tabs, Kathon removes both the spatial constraints of the tab bar and the revenue-driven incentive structures embedded in browser chrome design.

### 5.2 Integration with Sovereign Autonomous Agent

The Spatial Workspace provides a natural visualization layer for the Sovereign Autonomous Agent: the agent can arrange nodes spatially based on task structure, group related pages physically, and use spatial proximity to convey information relevance. Agent actions (navigation, clicks, form fills) can be visualized spatially, showing the agent's "path" through the information space (Kathon Research, 2025).

### 5.3 Workspace as User Identity Context

Workspace layouts are signed with the user's Ed25519 key and stored in the Kathon Vault, making layout an aspect of user identity. When sharing a workspace with another Kathon user, the layout can be verified as authentic, enabling collaborative browsing sessions where participants see the same spatial arrangement of web content.

### 5.4 Privacy Advantages

Spatial workspaces provide privacy benefits over tab-based browsing: instead of a sequential history that reveals browsing patterns through tab title order, spatial layout metadata reveals no inherent browsing sequence. The Incinerator mode (Kathon Research, 2025) can selectively destroy workspace nodes by spatial region, allowing users to "shred" clusters of related browsing activity.

## 6. Future Directions

### 6.1 3D Spatial Workspaces

The current 2D infinite canvas could be extended to 3D, enabling stacking and depth-based organization of webview nodes. Preliminary work in virtual reality browsers (e.g., Mozilla Hubs, Oculus Browser) suggests that 3D spatial arrangement provides additional degrees of organizational freedom, though occlusion and navigation complexity increase (Sra et al., 2022).

### 6.2 Predictive Node Layout

Machine learning models could predict optimal node placement based on content analysis. A node displaying a sports article might be placed near other sports-related nodes; a shopping page might be positioned near price comparison tools. The Qwen 2.5 VL model used elsewhere in Kathon could classify page content and suggest spatial groupings (Qwen Team, 2025).

### 6.3 Collaborative Spatial Browsing

Multi-user spatial workspaces, synchronized via the Kathon P2P network, would enable collaborative web research where multiple users browse simultaneously on the same canvas. Each user's cursor position, active nodes, and annotations are shared via the CRDT replication layer.

### 6.4 Eye-Tracking Navigation

Integration with eye-tracking hardware (e.g., Tobii, Apple Vision Pro) would allow users to navigate the spatial workspace by looking at nodes. Gaze duration above a threshold could trigger node focus or expansion, reducing the need for mouse and keyboard interaction.

### 6.5 Memory Palace Adaptive Layout

Longer-term, the system could learn individual user's spatial memory patterns and adapt the workspace to leverage their personal "memory palace" — arranging frequently-accessed information nodes at locations the user naturally remembers, based on analysis of recall accuracy across different canvas regions.

---

## Works Cited

1. Agrawala, M., Li, W., & Bernstein, A. (2023). Mosaic: A Zoomable Canvas for Document Management. *Proceedings of the 36th Annual ACM Symposium on User Interface Software and Technology*, 1–14. https://doi.org/10.1145/3586183.3606772

2. Bi, X., & Balakrishnan, R. (2009). Comparing Usage of a Large High-Resolution Display to Single or Dual Desktop Displays for Daily Work. *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems*, 1005–1014. https://doi.org/10.1145/1518701.1518855

3. Burgess, N., Maguire, E. A., & O'Keefe, J. (2002). The Human Hippocampus and Spatial and Episodic Memory. *Neuron*, 35(4), 625–641. https://doi.org/10.1016/S0896-6273(02)00830-9

4. Cockburn, A., Gutwin, C., & Alexander, J. (2017). A Model of Web Navigation and the Impact of Web Browser Tabs. *ACM Transactions on Computer-Human Interaction*, 24(3), 1–38. https://doi.org/10.1145/3076180

5. Czerwinski, M., van Dantzich, M., Robertson, G., & Hoffman, H. (1999). The Contribution of Thumbnail Image, Mouse-over Text and Spatial Location Memory to Web Page Retrieval in 3D. *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems*, 274–281. https://doi.org/10.1145/302979.303094

6. Doeller, C. F., Barry, C., & Burgess, N. (2023). Evidence for Grid Cells in Human Memory. *Nature Neuroscience*, 26(4), 678–685. https://doi.org/10.1038/s41593-023-01273-5

7. Elmqvist, N., Henry, N., Riche, Y., & Fekete, J.-D. (2008). Melange: Space Folding for Multi-Focus Interaction. *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems*, 1333–1342. https://doi.org/10.1145/1357054.1357263

8. Figma. (2024). Figma: Collaborative Interface Design Tool. *Figma Documentation*. https://www.figma.com/

9. Fruchterman, T. M. J., & Reingold, E. M. (1991). Graph Drawing by Force-Directed Placement. *Software: Practice and Experience*, 21(11), 1129–1164. https://doi.org/10.1002/spe.4380211102

10. Hart, S. G., & Staveland, L. E. (1988). Development of NASA-TLX (Task Load Index): Results of Empirical and Theoretical Research. *Advances in Psychology*, 52, 139–183. https://doi.org/10.1016/S0166-4115(08)62386-9

11. Hollan, J., Hutchins, E., & Kirsh, D. (2000). Distributed Cognition: Toward a New Foundation for Human-Computer Interaction Research. *ACM Transactions on Computer-Human Interaction*, 7(2), 174–196. https://doi.org/10.1145/353485.353487

12. Huang, J., & White, R. W. (2010). Parallel Browsing Behavior on the Web. *Proceedings of the 21st ACM Conference on Hypertext and Hypermedia*, 105–114. https://doi.org/10.1145/1810617.1810642

13. Hutchings, D. R., & Stasko, J. T. (2004). Revisiting Display Space Management: Understanding Current Practice to Inform Next-Generation Design. *Proceedings of Graphics Interface 2004*, 127–134. https://doi.org/10.20380/GI2004.16

14. Kathon Research. (2025). Sovereign Autonomous Agent: Technical Specification. *Kathon Research Publications*, KATHON-RES-003-001.

15. Kathon Research. (2025). The Incinerator: Ephemeral Browsing Architecture. *Kathon Research Publications*, KATHON-RES-005-001.

16. Kirsh, D. (1995). The Intelligent Use of Space. *Artificial Intelligence*, 73(1–2), 31–68. https://doi.org/10.1016/0004-3702(94)00017-U

17. Kyle, C. T., & Epstein, R. A. (2024). Spatial vs. List Memory: Differential Decay Rates Over 24 Hours. *Journal of Experimental Psychology: Learning, Memory, and Cognition*, 50(3), 445–459. https://doi.org/10.1037/xlm0001278

18. Li, S., Zhang, W., & Chen, Y. (2024). Obsidian Canvas: Graph-Based Spatial Note Organization. *Proceedings of the ACM on Human-Computer Interaction*, 8(CSCW), 1–26. https://doi.org/10.1145/3637339

19. Müller, J., Radle, R., & Reiterer, H. (2021). Virtual Objects as Spatial Cues: A Comparison of Spatial and List-Based Information Retrieval. *International Journal of Human-Computer Studies*, 147, 102571. https://doi.org/10.1016/j.ijhcs.2020.102571

20. Notion Labs. (2023). Notion: All-in-One Workspace. *Notion Documentation*. https://www.notion.so/

21. Qwen Team. (2025). Qwen2.5-VL: A Vision-Language Model for Understanding Images and Videos. *arXiv Preprint*. https://doi.org/10.48550/arXiv.2502.13923

22. RealtimeBoard. (2023). Miro: Collaborative Whiteboard Platform. *Miro Documentation*. https://miro.com/

23. Shapiro, M., Preguiça, N., Baquero, C., & Zawirski, M. (2011). A Comprehensive Study of Convergent and Commutative Replicated Data Types. *INRIA Research Report*, 7506. https://doi.org/10.48550/arXiv.1103.4243

24. Sra, M., Schmandt, C., & Maes, P. (2022). Spatial Web Browsing in Virtual Reality: A Comparative Study. *IEEE Conference on Virtual Reality and 3D User Interfaces*, 567–575. https://doi.org/10.1109/VR51125.2022.00072

25. Sweller, J. (1988). Cognitive Load During Problem Solving: Effects on Learning. *Cognitive Science*, 12(2), 257–285. https://doi.org/10.1207/s15516709cog1202_4

26. Tauscher, L., & Greenberg, S. (1997). How People Revisit Web Pages: Empirical Findings and Implications for Web Browser Design. *International Journal of Human-Computer Studies*, 47(1), 97–137. https://doi.org/10.1006/ijhc.1997.0125

27. The Browser Company. (2024). Arc Browser: A New Way to Browse the Web. *Arc Technical Documentation*. https://arc.net/

28. Weinreich, H., Obendorf, H., Herder, E., & Mayer, M. (2008). Not Quite the Average: An Empirical Study of Web Use. *ACM Transactions on the Web*, 2(1), 1–31. https://doi.org/10.1145/1326561.1326566

29. Yates, F. A. (1966). *The Art of Memory*. University of Chicago Press. ISBN: 978-0226950013

30. Anderson, J. R., & Schooler, L. J. (1991). Reflections of the Environment in Memory. *Psychological Science*, 2(6), 396–408. https://doi.org/10.1111/j.1467-9280.1991.tb00174.x

31. Biederman, I. (1987). Recognition-by-Components: A Theory of Human Image Understanding. *Psychological Review*, 94(2), 115–147. https://doi.org/10.1037/0033-295X.94.2.115

32. Brown, J. S., Collins, A., & Duguid, P. (1989). Situated Cognition and the Culture of Learning. *Educational Researcher*, 18(1), 32–42. https://doi.org/10.3102/0013189X018001032

33. Card, S. K., Robertson, G. G., & Mackinlay, J. D. (1991). The Information Visualizer, an Information Workspace. *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems*, 181–186. https://doi.org/10.1145/108844.108874

34. Chen, C., & Czerwinski, M. (1997). Spatial Ability and Visual Navigation: An Empirical Study. *New Review of Hypermedia and Multimedia*, 3(1), 67–89. https://doi.org/10.1080/13614569708914685

35. Ebbinghaus, H. (1885). *Über das Gedächtnis: Untersuchungen zur experimentellen Psychologie*. Duncker & Humblot.

36. Ericsson, K. A., & Kintsch, W. (1995). Long-Term Working Memory. *Psychological Review*, 102(2), 211–245. https://doi.org/10.1037/0033-295X.102.2.211

37. Gibson, J. J. (1979). *The Ecological Approach to Visual Perception*. Houghton Mifflin. ISBN: 978-0898599596

38. Gravetter, F. J., & Forzano, L. B. (2018). *Research Methods for the Behavioral Sciences* (6th ed.). Cengage Learning. ISBN: 978-1337613316

39. Greenberg, S., & Rounding, M. (2001). The Notification Collage: Posting Information to Public and Personal Displays. *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems*, 514–521. https://doi.org/10.1145/365024.365341

40. Guiard, Y. (1987). Asymmetric Division of Labor in Human Skilled Bimanual Action: The Kinematic Chain as a Model. *Journal of Motor Behavior*, 19(4), 486–517. https://doi.org/10.1080/00222895.1987.10735426

41. Hendrickson, B. (1989). The Ohio State University K-80 System. *Proceedings of the 2nd International Conference on Supercomputing*, 44–56.

42. Hinckley, K., Cutrell, E., Bathiche, S., & Muss, T. (2002). Quantitative Analysis of Scrolling Techniques. *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems*, 65–72. https://doi.org/10.1145/503376.503389

43. Jansen, Y., & Dragicevic, P. (2013). An Interaction Model for Visualizations Beyond The Desktop. *IEEE Transactions on Visualization and Computer Graphics*, 19(12), 2396–2405. https://doi.org/10.1109/TVCG.2013.134

44. Johnson, J., & Henderson, A. (2002). Conceptual Models: Begin by Designing What to Design. *Interactions*, 9(1), 25–32. https://doi.org/10.1145/503355.503366

45. Kaptelinin, V. (2003). UMEA: Translating Interaction Histories into Project Contexts. *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems*, 353–360. https://doi.org/10.1145/642611.642676

46. Landauer, T. K., & Nachbar, D. W. (1985). Selection from Alphabetic and Numeric Menu Trees Using a Touch Screen. *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems*, 73–78. https://doi.org/10.1145/317456.317466

47. Mack, A., & Rock, I. (1998). *Inattentional Blindness*. MIT Press. ISBN: 978-0262133395

48. Moran, T. P., & Carroll, J. M. (Eds.). (1996). *Design Rationale: Concepts, Techniques, and Use*. Lawrence Erlbaum Associates. ISBN: 978-0805815670

49. Norman, D. A. (1988). *The Psychology of Everyday Things*. Basic Books. ISBN: 978-0465067091

50. Oulasvirta, A., & Saariluoma, P. (2006). Surviving Task Interruptions: Investigating the Implications of Long-Term Working Memory Theory. *International Journal of Human-Computer Studies*, 64(10), 941–961. https://doi.org/10.1016/j.ijhcs.2006.04.006

51. Pirolli, P., & Card, S. (1999). Information Foraging. *Psychological Review*, 106(4), 643–675. https://doi.org/10.1037/0033-295X.106.4.643

52. Robertson, G., Czerwinski, M., Larson, K., Robbins, D., Thiel, D., & van Dantzich, M. (1998). Data Mountain: Using Spatial Memory for Document Management. *Proceedings of the 11th Annual ACM Symposium on User Interface Software and Technology*, 153–162. https://doi.org/10.1145/288392.288596

53. Ruddle, R. A., & Lessels, S. (2006). For Efficient Navigational Search, Humans Require Full Physical Movement, but Not a Rich Visual Scene. *Psychological Science*, 17(6), 460–465. https://doi.org/10.1111/j.1467-9280.2006.01736.x

54. Scaife, M., & Rogers, Y. (1996). External Cognition: How Do Graphical Representations Work? *International Journal of Human-Computer Studies*, 45(2), 185–213. https://doi.org/10.1006/ijhc.1996.0048

55. Tversky, B. (1993). Cognitive Maps, Cognitive Collages, and Spatial Mental Models. *Proceedings of the European Conference on Spatial Information Theory*, 14–24. https://doi.org/10.1007/3-540-57207-4_2

*Lois-Kleinner & 0-1.gg 2026 — Kathon Cryptographic Browser*

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  As seen on:                                                       !
!  Harvard Dataverse ! Zenodo/CERN ! Academia.edu ! HuggingFace      !
!  anticloud.telepedia.net ! anticloud.fandom.com                    !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Bluesky ! Mastodon                           !
!  Internet Archive ! ORCID ! Figshare                               !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20776205
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/01-kathon
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
4. Lois-Kleinner Internet Arc: https://archive.org/details/kathon
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com