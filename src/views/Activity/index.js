import Routine from './Routine'
import Point from './Point'

const activityRoutes = [
  {
    name: 'routine',
    component: Routine,
    options: {
      title: '加载中...'
    }
  },
  {
    name: 'point',
    component: Point,
    options: {
      title: '加载中...'
    }
  }
]

export default activityRoutes
