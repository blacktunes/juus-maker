import mitt from 'mitt'

type Events = {
  play: void
  stop: void
  save_talk: void
  save_juus: void
}

export const emitter = mitt<Events>()
