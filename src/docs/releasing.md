# Releasing

Releases are driven by `package.json` and pull request labels. After the first
release nothing is published by hand.

## How it works

Every push to `master` runs `release-management.yml`:

1. It lints and tests the package.
2. If the version in `package.json` did not change, release-drafter updates the
   draft release on GitHub from the merged pull requests. Their labels, set by
   `pr-labeler.yml` from the branch name, sort them into the changelog and
   decide the next version: `BC` is major, `feature` minor, anything else patch.
3. If the version changed, the draft is published as `v<version>` and the
   package is published to npm with provenance. The workflow authenticates
   through [trusted publishing](https://docs.npmjs.com/trusted-publishers),
   there is no npm token anywhere.

The version check reads commit messages, not the diff. A push counts as a
version bump when a commit message contains the new version, so the release
branch and the release commit both carry it.

## Releasing a version

1. Open the draft release on GitHub and check the version release-drafter
   resolved from the labels. Fix labels on the merged pull requests if it is
   wrong.
2. Bump the version on a `release/*` branch, which `pr-labeler.yml` keeps out
   of the changelog:

   ```sh
   git checkout master && git pull
   git checkout -b release/1.1.0
   npm version minor --no-git-tag-version
   git commit -am "Release version 1.1.0"
   git push -u origin release/1.1.0
   ```

3. Open a pull request titled `Release version 1.1.0` and merge it. The tag is
   created by the workflow, do not push one.

## The first release

npm registers a trusted publisher only for a package that already exists, so
the first version is published by hand and the automation takes over from the
second one.

1. Merge the pull request that adds the package with the first version in
   `package.json`. The workflow drafts a release and publishes nothing, because
   no commit message carries the version.
2. Publish from `master` with an npm account that has two-factor
   authentication:

   ```sh
   npm publish
   ```

3. Register the workflow as a trusted publisher, npm 11.15 or newer:

   ```sh
   npm trust github --allow-publish \
     --repo react-ui-org/stylelint-config \
     --workflow release-management.yml
   ```

4. Publish the draft release on GitHub by hand. Release-drafter resolves its
   version from the labels and the previous tag, and there is no previous tag
   yet, so rename it to `v1.0.0` first if it resolved anything else.
