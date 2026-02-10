import os

PREFERRED_URL_SCHEME = 'http'
# SERVER_NAME removed to allow requests from any host (localhost, docker internal network, etc.)
# SERVER_NAME = os.environ.get('SERVER_NAME', 'localhost:8080')
FREEZER_IGNORE_404_NOT_FOUND = True
FREEZER_STATIC_IGNORE = ["*"]
ERROR_404_HELP = False
JETBRAINS = 'https://www.jetbrains.com/'

GITHUB_URL = 'https://github.com/JetBrains/kotlin'
TWITTER_URL = 'https://twitter.com/kotlin'
SLACK_URL = 'https://surveys.jetbrains.com/s3/kotlin-slack-sign-up'
REDDIT_URL = 'https://www.reddit.com/r/Kotlin/'
