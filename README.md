# auto-roam2agora

auto-roam2agora uses Github actions and [roam2agora](https://github.com/nikvdp/roam2agora) to automatically export the choicest tidbits of your roam graph to the web! It works by reading in your roam graph, looking for `#public` or `#public_page` tags, and then uploading them to a GitHub repository of your choice as markdown (more details at the [roam2agora repo](https://github.com/nikvdp/roam2agora)). From there you can use it with [anagora.org](https://anagora.org/) or a static site generator of your choice to publish as a web site.

Here's what you'll need to get started:

- a roam account
- a github account
- about 15 minutes to get everything set up

Once you've gone through the setup process, Github will take care of updating the agora with the contents of your roam graph every 15 minutes. 

## Quickstart

For now these directions assume you've got some familiarity with git and github. More beginner-friendly directions coming soon! In the meantime, feel free to ping me on [twitter](https://twitter.com/arghzero) if you need help!

If you've done this kind of thing before here's the tl;dr:

- Fork this repo to your github account
- Enable actions on your fork (go to the Actions tab and click the big green "I understand my workflows, go ahead and enable them" button)
- [Create a personal access token](https://github.com/settings/tokens) with `repo` permissions
- Create a new github repo in your account to store the files (we will refer to this repo as the garden repo going forward), and take note of it's HTTP clone URL
- In your fork add the following github secrets:
    - `ROAMUSERNAME` - the email address you use to sign in to roam
    - `ROAMPASSWORD` - your roam password
    - `ROAMDATABASE` - the roam database that contains the pages or blocks you'd like to publish to the agora
    - `GITHUBTOKEN` - the personal access token you created above
    - `GARDENREPO` - the https (**not ssh!**) clone URL for the github repo that will store your garden

That's it! Once the above steps have been completed if you have any `#public` or `#public_page` tags in your Roam graph they should appear as markdown files in your garden repository shortly and will automatically update with the latest changes from your roam graph every ~15m or so.

If you'd like to to watch your notes frolic and gambole with other user's notes on [anagora.org](https://anagora.org/) ping [@flancian](https://twitter.com/flancian) on twitter and he'll get you set up.
