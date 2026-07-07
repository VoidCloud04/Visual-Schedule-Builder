class Snackbar {
    visible = $state(false)
    content = $state('')
    type = $state('base')
    
    #timeout = null

    show(content, type = 'base', duration = 10000) {
        this.content = content
        this.type = type
        this.visible = true

        if(this.#timeout) {
            clearTimeout(this.#timeout)
        }

        this.#timeout = setTimeout(() => {
            this.visible = false
        }, duration)

    }

    hide() {
        this.visible = false

        if(this.#timeout) {
            clearTimeout(this.#timeout)
            this.#timeout = null
        }
    }
}

export const snackbar = new Snackbar()