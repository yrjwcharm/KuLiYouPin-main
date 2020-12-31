import React from 'react'

const defaultOptions = {
  addGlobalClass: true
}
export const BaseComponent = (WrappedComponent, options = defaultOptions) => {
  return class extends React.Component {
    static options = options

    render () {
      return (
        <WrappedComponent {...this.props} />
      )
    }
  }
}
