export const colors = {
  primaryBlue: '#0022A1',
  primaryRed: '#E33821',
  primaryActionButtons: '#757575'
};

export const tabDesign = {
  tabItemContainerStyle: {
    backgroundColor: 'transparent',
  },
  buttonStyle: {
    color: colors.primaryBlue,
    fontSize: 20
  },
  inkBarStyle: {
    backgroundColor: colors.primaryRed
  }
};

export const closeButton = {
  backgroundColor: '#FFFFFF'
};

export const leftCloseButton = {
  borderRadius: '50%',
  boxShadow: '0px 2px 9px -2px #000',
  float: 'left',
  backgroundColor: '#fff'
};

export default { tabDesign, colors, leftCloseButton };
