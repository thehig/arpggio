const React = require('react');
const ArpggioMapComponent = require('arpggio-map-component'); //eslint-disable-line

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: null,
      tool: null,
      viewer: null,
    };

    this.onChangeValue = this.onChangeValue.bind(this);
    this.onChangeTool = this.onChangeTool.bind(this);
    this.onSetViewer = this.onSetViewer.bind(this);
  }

  onChangeValue(value) {
    console.log('changeValue', JSON.stringify(value));
    this.state.value = value;
  }

  onChangeTool(tool) {
    console.log('changeTool', this.state.tool, tool);
    this.state.tool = tool;
  }

  onSetViewer(viewer) {
    console.log('setViewer', this.state.viewer, viewer);
    this.state.viewer = viewer;
  }

  render() {
    const { value, tool } = this.state;
    return (
      <ArpggioMapComponent
        onChangeValue={this.onChangeValue}
        onChangeTool={this.onChangeTool}
        onSetViewer={this.onSetViewer}
        viewerValue={value}
        viewerTool={tool}
      >
        <svg width={800} height={800}>
          <rect x="400" y="40" width="100" height="200" fill="#4286f4" stroke="#f4f142" />
          <circle cx="108" cy="108.5" r="100" fill="#0ff" stroke="#0ff" />
          <circle cx="180" cy="209.5" r="100" fill="#ff0" stroke="#ff0" />
          <circle cx="220" cy="109.5" r="100" fill="#f0f" stroke="#f0f" />
        </svg>
      </ArpggioMapComponent>
    );
  }
}

export default App;
