<template>
  <a :href="link" target="_blank" class="card-item row-3">
    <img :src="avatar" class="no-zoom" />
    <div>
      <p class="name">{{ name }}</p>
      <p class="desc">{{ desc }}</p>
    </div>
  </a>
</template>

<script>
export default {
  name: 'LinkCard',
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    name() {
      return this.info.name || '';
    },
    link() {
      return this.info.link || '';
    },
    avatar() {
      return this.info.avatar || '';
    },
    desc() {
      return this.info.desc || '';
    },
    backgroundColor() {
      return this.info.backgroundColor || '';
    },
  },
};
</script>

<style lang='stylus'>
.cardListContainer {
  margin: 0.7rem 0;

  .card-list {
    margin: -0.35rem;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;

    .card-item:hover {
      border-color: rgba(0, 0, 0, 0.1);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .card-item {
      width: calc(33.33333% - 0.7rem);
      margin: 0.35rem;
      background: #F6F6F6;
      border-radius: 3px;
      color: var(--textColor);
      display: flex;
      box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.06);
      transition: all 0.4s;

      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 2px solid #fff;
        margin: 1rem 0 1rem 1rem;
        box-shadow: 3px 2px 5px rgba(0, 0, 0, 0.08);
        transition: all 0.4s;
      }

      div {
        flex: 1;
        display: inline-flex;
        padding: 1rem 0;
        height: 100px;
        max-height: 100px;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        p {
          margin: 0;
          padding: 0 1rem;
          transition: text-shadow 0.4s;
          text-align: center;
        }

        .name {
          margin: 0.2rem 0 0.3rem;
        }

        .desc {
          font-size: 0.8rem;
          line-height: 1.1rem;
          opacity: 0.8;
          margin-bottom: 0.2rem;
        }
      }
    }
  }
}
</style>
