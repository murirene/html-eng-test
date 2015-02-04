# Vevo HTML engineer test project

## Gettin' Goin' (Mac OS X)

1. Fork this repo [on Github](https://github.com/vevo-arthur-klepchukov/html-eng-test)

```sh
git clone https://github.com/your-fork/html-eng-test.git
cd html-eng-test

# install depdendencies
npm install

# run
npm start

# browse
open http://localhost:3003
```

## Your task, should you choose to accept it

### High-level
Our beta users have been clamoring for video voting. You're going to put together a prototype of the feature as sketched by the designer:

![Concept from design](./designConcept.jpg)

Integrate this into our site as you see best. _You don't have to follow this sketch!_

### Time
This straightforward task should take 2 - 4 hours. We expect your results 24 hours after sending it to you.

### Details
The oh-so-generous Vevo API has provided us a sample list of 100 videos (__./topVideos.json__). 

1. Please display these videos when a user navigates to __/videos__. 
2. Sort the videos by the number of votes — from most votes to least.
3. Users should be able to vote for or against each video. You don't have to save these votes back to the Vevo API.
4. Since there are so many (so many!) videos, please let the user filter the videos whichever way you think is best. 
5. Commit your changes, push them back to your fork, and email a link to your fork to [htmldevs@vevo.com](mailto:htmldevs@vevo.com).

