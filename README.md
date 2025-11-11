# Martin Bavio <> WorKOS Take-Home Assignment

Welcome to my version of the [WorkOS](https://workos.com/) Frontend Take-Home Assignment!

In this POC, I’ve implemented the UI for a simple two-tab layout that lists users and roles. All CRUD functionality should work for both users and roles.

The UI is based on the Figma design file I received for the take-home assignment.

In order to be able to complete this exercise on time, I used 3rd party libraries, including [Radix UI](https://www.radix-ui.com/) and [TanStack Query](https://tanstack.com/query/latest). The full-list (and reasons behind each decision) is included in the tech stack section. [Claude Code](https://www.claude.com/product/claude-code) (CC) was used as an assistant and it was a pleasure to work with.

If you are reviewing this and have any questions, feel free to [reach out](mailto:mbavio@gmail.com) — I’m happy to clarify anything.

## Time Consideration

I spent 8 hours building this. I also took some extra time in order to polish the UI and update this README file before delivering my results.

There were things that I did not get to which I’d list in the todo section.

## Getting Started

1. **Clone the Repo**: Clone the repo so that you have your own local version to play with.
2. **Start the Backend API**:
 ```bash
     cd server
     npm install
     npm run api
 ```
3. **Start the Frontend App**:
```bash
     cd client
     npm install
     npm run dev
 ```

## File Structure
```
server // backend API
client // frontend app
	src
		- main.tsx // where React connects to the DOM
		- App.tsx // Main entry point for our app
		features
			users // Folder with users business logic
			roles // Folder with roles business logic
			shared // Folder with shared business logic
```

## Process Overview

I received the Figma file invitation before getting the repo with instructions, so out of curiosity I started working on an AI workflow that I’ve found interesting lately: first I created a comprehensive `Claude.MD` file where I listed the tech stack I wanted to use, mostly describing that I wanted to use Radix Themes and Radix UI Primitives in order to build the UI. After doing that I went into Figma and enabled their MCP. Finally I instructed Claude Code to build the current selected Figma component in code following the desired tech stack. The result was astonishingly good, both from a visual and a code quality point of view. I then instructed Claude Code to do the same with the other two screens, by prompting to those were intended to be built on top of the original UI (actions dropdown and delete user dialog). Again, the results were way better than expected. This took me approximately 20 minutes so it was a pleasant surprise to see that I had a super strong early prototype already built and I still had a lot of time in order to work on *the rest*.

After I was done with this and expecting for the exercise to not be as simple as that, I asked for the take-home exercise and Anna was kind enough to send it to me right away. I could easily verify then that it was gonna be more complex, considering that there was a real backend to integrate and a bunch of extra requests.

I moved the code that I had built into the client folder and tweak `CLAUDE.md` in order to considerate the updates, including the fact that the server folder shouldn’t be touched but it should be used as a reference, and that TanStack Query was getting included into the party.

Then I worked on making dynamic what I had built by including proper primitives for the TanStack Query integration and making those to work on the app. I followed the process of asking Claude Code for an initial attempt at doing this and then working on polishing the code, by using my experience on using the React Query and following some of React best practices I’ve had the most success with in the past.

After confirming that the UI was using backend data properly, I stop for a little bit in order to write a plan for the rest of the exercise, and come up with a list in order to work piece by piece on what I wanted to build. Here’s that list:

**MUST:**
- Add code comments and split files if necessary
- Support URL query strings (active tab, query search and page)
- Improve React code
- Add success and error states
- Verify UI is accurate
- Make UI to look slightly more good-looking
- Handle error fetching users
- Figure out if debouncing search is needed
- Rewrite the README

**NICE TO HAVE:**
- Make search more responsive
- Implemente optimistic updates
- Improve loading spinner (play with WorkOS logo)

Once I have that list I started working on each item in order, trying not to take too many detours (sometimes it happened!)

Highlights from working on the list coming next.

I didn’t add many comments as I try to organize the code in the most expressive way possible, including having TS types everywhere I can. I’m sure more comments could be added but I had the clock ticking so I decided to mostly focus on splitting the logic based on business domain, or features: users, roles and shared.

I knew from the scratch that I wanted to support URL query strings. Even if this is a SPA I find it critical that web developers respect the URL as the big first primitive of the web. Being able to [go directly to the roles tab](http://localhost:3001/?tab=roles) or [sharing the users list with certain filter](http://localhost:3001/?q=mark) are design decisions that can’t be described on a Figma mockup but to me are as important as aesthetics. I used [nuqs](https://nuqs.dev/) in order to support URL query strings.

When working on improving React code, I tried to apply some of the lessons I’ve learned over the years in order to improve some naivety that I found on the React code that CC introduced. This includes converting many `useState` that were colocated together in the same component into single reducers-`useReducer` combos, which made the logic more expressive and easier to follow/understand. I also created custom hooks to abstract business logic and even got to use a discriminated union in order to prevent multiple states from being possible on screen at the same time. This is the part where I used CC’s help the least.

I kinda spent a little bit too much time on verifying UI’s alignment with design and adding my own UI tiny nits here and there, which made me miss the last two items from the MUST list: handle error fetching users and checking on search debounce. I did not get to work on any of the NICE TO HAVE items.

I finally worked on fully manually writing this text that you are hopefully reading!

## Tech stack

- [Vite](https://vite.dev/): it looked like this could be built as a SPA for the exercise so Vite is my go-to for React SPA.
- [React](https://react.dev/): I know that I would use React at WorkOS and it’s the library/framework where I’ve spent most of my dev time the last couple of years so this was a no-brainer.
- [Radix UI](https://www.radix-ui.com/): I knew I didn’t want to build UI components from scratch because it’s a lot more than just making it *look* as it’s designed, and I’ve used Radix in the past so this was another easy decision to make. In the past I’ve only used Primitives so it was my first time using Themes. It was not a surprise that it was as idiomatic as its cousin!
- [React (TanStack) Query](https://tanstack.com/query/latest): the industry’s goto when it comes to async state. The fact that it has cache management out of the box via query keys made this decision a no-brainer, since handling cache was part of the requirements.
- [nuqs](https://nuqs.dev/): a tool that looks as idiomatic as the rest of the stack so they played in the same band very nicely. It has stellar docs so Claude had no issue at one-shooting an initial working integration that I could fine-tune and adapt to my own preferences once it was done.
- CSS: I added some tiny CSS here and there, I love CSS and would have loved to have time to write more of it but there was a problem needed to be solved on time.
- [Claude Code](https://www.claude.com/product/claude-code) and [Figma’s MCP](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server): I could only achieve as many on time because I think I squeezed CC as much as possible, by trying to prompt it to make an initial pass at many of the features I wanted to build. It’s really magical how a good `Claude.MD` and good prompting completely changes how it works.

## TODO (if I had more time)

I would definitely work on the remaining two items of the TODO list. Then I would pick items from the NICE TO HAVE list, which might also include talking with peers in order to know if they are really nice to have or not necessary at all.
