const prefix = 'https://chatflow-files-cdn-1256085166.cos.ap-chengdu.myqcloud.com/images/'

const backgroundImages = [
  '4TVbbaNAw9Q.jpg',
  'klerk-OomNPPv1Rpk.jpg',
  'leone-venter-VieM9BdZKFo.jpg',
  'purzlbaum-kxAaw2bO1Z8.jpg',
  'santiago-gomez-WpZmGDzOAi0.jpg'
].map(name => prefix + name)

module.exports = {
  backgroundImages
}
