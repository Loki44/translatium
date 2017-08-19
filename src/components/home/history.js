import React from 'react';
import PropTypes from 'prop-types';

import { LinearProgress } from 'material-ui/Progress';
import IconButton from 'material-ui/IconButton';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import ActionDelete from 'material-ui-icons/Delete';
import Divider from 'material-ui/Divider';

import connectComponent from '../../libs/connect-component';

import { deleteHistoryItem, loadHistory } from '../../actions/history';
import { loadOutput } from '../../actions/home';

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  listContainer: {
    flex: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    padding: 0,
    boxSizing: 'border-box',
  },
  progress: {
    marginTop: 12,
  },
};

class History extends React.Component {
  componentDidMount() {
    const { onEnterHistory, onLoadMore } = this.props;

    onEnterHistory();

    if (this.listView) {
      this.listView.onscroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = this.listView;

        if (scrollTop + clientHeight > scrollHeight - 200) {
          if (this.props.canLoadMore === true && this.props.historyLoading === false) {
            onLoadMore();
          }
        }
      };
    }
  }

  componentWillUnmount() {
    if (this.listView) this.listView.onscroll = null;
  }

  render() {
    const {
      classes,
      historyItems,
      historyLoading,
      onDeleteButtonClick,
      onItemClick,
      strings,
    } = this.props;

    return (
      <div className={classes.container}>
        {(() => {
          if (historyItems.length < 1 && historyLoading === false) {
            return null;
          }

          return (
            <div className={classes.listContainer} ref={(c) => { this.listView = c; }}>
              <List>
                {historyItems.map(item => [(
                  <ListItem
                    key={`historyItem_${item.historyId}`}
                    onClick={() => onItemClick(item)}
                  >
                    <ListItemText
                      primary={item.outputText}
                      secondary={item.inputText}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        aria-label={strings.removeFromHistory}
                        onClick={() => {
                          onDeleteButtonClick(
                            item.historyId,
                            item.rev,
                          );
                        }}
                      >
                        <ActionDelete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ), <Divider inset={false} />])}
              </List>
              {historyLoading && (
                <LinearProgress mode="indeterminate" className={classes.progress} />
              )}
            </div>
          );
        })()}
      </div>
    );
  }
}

History.propTypes = {
  canLoadMore: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  historyItems: PropTypes.arrayOf(PropTypes.object),
  historyLoading: PropTypes.bool,
  onDeleteButtonClick: PropTypes.func.isRequired,
  onEnterHistory: PropTypes.func.isRequired,
  onItemClick: PropTypes.func.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  strings: PropTypes.objectOf(PropTypes.string).isRequired,
};

const mapStateToProps = state => ({
  historyItems: state.history.items,
  canLoadMore: state.history.canLoadMore,
  historyLoading: state.history.loading,
  strings: state.strings,
});

const mapDispatchToProps = dispatch => ({
  onItemClick: output => dispatch(loadOutput(output)),
  onDeleteButtonClick: (id, rev) => dispatch(deleteHistoryItem(id, rev)),
  onEnterHistory: () => dispatch(loadHistory(true)),
  onLoadMore: () => dispatch(loadHistory()),
});

export default connectComponent(
  History,
  mapStateToProps,
  mapDispatchToProps,
  styles,
);