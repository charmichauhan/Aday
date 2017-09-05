export const colors = {
  primaryBlue: '#0022A1',
  primaryRed: '#E33821',
  primaryGreen: '#00a863',
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
  backgroundColor: '#fff',
  width: 43,
  height: 43,
};

export const notificationStyles = {
  success: {
    backgroundColor: colors.primaryGreen,
    textAlign: 'center'
  },
  error: {
    backgroundColor: 'rgba(238, 54, 34, 0.9)',
    textAlign: 'center'
  },
  warning: {
    backgroundColor: '#FFA000',
    textAlign: 'center'
  }
};

export default { tabDesign, colors, leftCloseButton };
