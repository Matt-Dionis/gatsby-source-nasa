const fetch = require('node-fetch');
const uuidv4 = require('uuid/v4');

const URL = {
  apod: 'https://api.nasa.gov/planetary/apod',
  epic: 'https://api.nasa.gov/EPIC/api/natural/date/'
};

const now = new Date();
const currentDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];

const _buildUrl = ({type, date}, key) => {
  date = date || currentDate;
  const urlParams = type === 'epic' ? `${date}?api_key=${key}` : `?date=${date}&api_key=${key}`;
  return `${URL[type]}${urlParams}`;
};

const _isPlainObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]';

const _processNode = (createNodeId, createContentDigest, data) => {
  const nodeId = createNodeId(`nasa-data-${uuidv4()}`);
  const nodeContent = JSON.stringify(data);
  const nodeData = Object.assign({}, data, {
    id: nodeId,
    parent: null,
    children: [],
    internal: {
      type: 'NasaData',
      content: nodeContent,
      contentDigest: createContentDigest(data)
    }
  });

  return nodeData;
};

exports.sourceNodes = async ({actions, createNodeId, createContentDigest}, configOptions) => {
  const {createNode} = actions;
  delete configOptions.plugins;

  const {key, images} = configOptions;

  images.forEach(async (image) => {
    const response = await fetch(_buildUrl(image, key));
    let data = await response.json();

    if (image.type === 'epic' && data.length) {
      data = data[0];
      data.url = `https://epic.gsfc.nasa.gov/archive/natural/${image.date.replace(/-/g, '/')}/png/${data.image}.png`;
    }
    if (_isPlainObject(data)) {
      data.type = image.type;
      const nodeData = _processNode(createNodeId, createContentDigest, data);
      createNode(nodeData);
    }
  });
};
