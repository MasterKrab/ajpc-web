<script>
  import { onMount } from 'svelte'

  const MAX_LENGTH_TEXT = 200

  let accountName, profileImage

  let post = null

  onMount(async () => {
    const response = await fetch('/api/instagram-profile')
    const data = await response.json()

    accountName = data.accountName
    profileImage = data.profileImage
    post = data.posts[0]
  })
</script>

{#if accountName}
  <article class="profile">
    <div class="profile__info">
      <a href="https://www.instagram.com/{accountName}" target="_blank">
        <img class="profile__image" src={profileImage} alt={accountName} />
      </a>
      <h2 class="profile__name">
        <a href="https://www.instagram.com/{accountName}" target="_blank"
          >{accountName}</a
        >
      </h2>
    </div>

    {#if post}
      <div class="post">
        <a href={post.url} target="_blank">
          <img class="post__image" src={post.image} alt={post.contentText} />
        </a>

        <p class="post__content">
          <a href={post.url} target="_blank">
            {post.contentText.length > MAX_LENGTH_TEXT
              ? `${post.contentText.slice(0, MAX_LENGTH_TEXT)}...`
              : post.contentText}
          </a>
        </p>
      </div>
    {/if}
  </article>
{/if}

<style>
  .profile__info,
  .post__content {
    padding: 1rem;
  }

  .profile__info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .profile__image {
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    object-fit: cover;
  }

  .profile__name {
    font-size: 1.2em;
    margin-top: 0;
    margin-bottom: 0;
  }
</style>
