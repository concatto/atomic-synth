import React from 'react';
import Dialog, { DialogTitle, DialogActions } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import Tabs, { Tab } from 'material-ui/Tabs';
import List, { ListItem, ListItemText } from 'material-ui/List';
import range from 'lodash/range';

const section = (name, lower, upper) => ({name, lower, upper});
const sections = [
  section("Piano", 0, 8),
  section("Chromatic", 8, 16),
  section("Organ", 16, 24),
  section("Guitar", 24, 32),
  section("Bass", 32, 40),
  section("Strings", 40, 48),
  section("Ensemble", 48, 56),
];

class InstrumentDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {tabIndex: 0};
  }

  createTabs() {
    return sections.map(section => (
      <Tab key={section.lower} label={section.name}/>
    ));
  }

  createTabContent() {
    const section = sections[this.state.tabIndex];
    const { instruments, onComplete } = this.props;

    return (
      <List>
        {range(section.lower, section.upper).map(i => (
          <ListItem key={i} button onClick={() => onComplete(instruments[i])}>
            <ListItemText primary={instruments[i].name}/>
          </ListItem>
        ))}
      </List>
    );
  }

  render() {
    const { tabIndex } = this.state;
    const { onClose, open } = this.props;

    return (
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>Choose an instrument</DialogTitle>
        <div>
          <Tabs value={tabIndex}
            indicatorColor="primary"
            textColor="primary"
            onChange={(e, tabIndex) => this.setState({tabIndex})}
          >
            {this.createTabs()}
          </Tabs>

          {this.createTabContent()}
        </div>
      </Dialog>
    );
  }
}

export default InstrumentDialog;
