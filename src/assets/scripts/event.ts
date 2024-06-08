import mitt from 'mitt'

type Events = {
  play: void
  stop: void
  screenshot: void
}

export const emitter = mitt<Events>()
