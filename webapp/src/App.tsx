import { styled, createGlobalStyles } from 'solid-styled-components'
import { Accessor, createEffect, createMemo, createSignal, For, onMount } from "solid-js";
import hotkeys from 'hotkeys-js';

const SERVER_URL = 'http://ec2-3-125-113-118.eu-central-1.compute.amazonaws.com:4000';

const GlobalStyles = () => {
  const Styles = createGlobalStyles`
    html,
    body {
      padding: 0;
      margin: 0;
      font-family: sans-serif;
    }

    * {
      box-sizing: border-box;
    }
  `;
  return <Styles />;
};

const Box = styled.div`
  margin: 0 auto;
  padding: 8px;
  max-width: 1024px;
`;

const Header = styled.header`
  padding: 8px;
  background-color: rgb(28%, 1%, 96%);
  color: #fff;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-gap: 8px;
  row-gap: 8px;
  
  --gridItemCount: 2; 
  grid-template-columns: repeat(var(--gridItemCount), minmax(0, 1fr));

  @media screen and (min-width:720px) {
    --gridItemCount: 4; 
  }

  @media screen and (min-width:1024px) {
    --gridItemCount: 6; 
  }
`;

const SoundButton = styled.button<{selected: Accessor<boolean>, playing: Accessor<boolean>}>`
  border-radius: 4px;
  border: 0;
  background-color: rgb(82.1%, 79.2%, 89.4%);
  font-size: 1.15em;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  outline: none;
  transition: box-shadow 0.3s, transform 0.2s;
  cursor: pointer;

  ${props => props.selected() && `
      box-shadow: 0 0 0 4px rgb(47.7%, 37.7%, 71%, 0.7);
  `}

  ${props => {
    console.log('props.playing()', props.playing());
    
    return props.selected() && props.playing() && `
      transform: scale(0.99);
  `
  }} 
`;

const SearchInputForm = styled.form`
  padding: 8px 8px;
  margin-bottom: 8px;
  position: sticky;
  top: 0;
  background-color: #fff;
`;

const SearchInput = styled.input`
  width: 100%;
  border: 0;
  border-radius: 4px;
  padding: 16px;
  font-size: 1.5em;
  outline: none;
  background-color: rgb(92.7%, 91.8%, 94.8%);
  border: 2px solid rgb(60.4%, 49.8%, 85.1%);
`;

async function getSounds() {
  console.log('get me');
  
  const result = await fetch(`${SERVER_URL}/sounds`);
  return result.json();
}

async function playSounds(sounds: string[]) {
  if (sounds.length > 0) {
    await fetch(`${SERVER_URL}/play`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sounds })
    });
  }  
}

// Allow shortcuts in input
hotkeys.filter = function() {
  return true;
}

export function App() {
  const [sounds, setSounds] = createSignal([]);
  const [searchTerm, setSearchTerm] = createSignal('');
  const [selected, setSelected] = createSignal(null);
  const [playing, setPlaying] = createSignal(false);
  let searchEl;

  createEffect(() => {
    console.log('selected', selected());
  });

  const filteredSounds = createMemo(() => {    
    const searchTermWords = searchTerm().split(' ');
    return sounds().filter(item => searchTermWords.every(word => item.includes(word)));
  });

  // if (window.location.hash) {
  //   const authInfo = new URLSearchParams(window.location.hash.substring(1));
  //   window.sessionStorage.setItem('access_token', authInfo.get('access_token'));
  // } else if (!window.sessionStorage.getItem('access_token')) {
  //   window.location.href = 'https://discord.com/api/oauth2/authorize?response_type=token&client_id=907331676655476787&state=15773059ghq9183habn&scope=identify&redirect_uri=http%3A%2F%2Flocalhost%3A3001';
  // }

  // if (window.sessionStorage.getItem('access_token')) {
    getSounds().then(apiSounds => {
      setSounds(apiSounds);
    });
  // }

  const startPlaying = async (soundsToPlay: string[]) => {
    setPlaying(true);
    setTimeout(() => setPlaying(false), 200);
    if (soundsToPlay.length === 1) {
      setSelected(filteredSounds().indexOf(soundsToPlay[0]))
    }
    await playSounds(soundsToPlay);
    if (window.donBotto) {
      window.donBotto.soundSelected();
    }
  }

  const handleInputChange = e => {
    setSearchTerm(e.currentTarget.value)
    setSelected(0)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // playSounds(filteredSounds());
  }

  onMount(() => {
    searchEl.focus();
  })

  hotkeys('ctrl+f, command+f', e => {
    e.preventDefault() 
    searchEl.focus();
  });

  hotkeys('down, right, tab', (e) => {
    e.preventDefault();
    if (selected() === null) {
      setSelected(0)
    } else {
      setSelected(val => Math.min(val + 1, filteredSounds().length - 1))
    }
  })

  hotkeys('up, left, shift+tab', (e) => {
    e.preventDefault();
    if (selected() === null) {
      setSelected(0)
    } else {
      setSelected(val => Math.max(val - 1, 0))
    }
  })

  hotkeys('esc', e => {
    e.preventDefault();
    setSelected(null)
    setSearchTerm('')
    searchEl.focus();
  });

  hotkeys('enter', e => {
    e.preventDefault();
    if (selected() !== null) {
      startPlaying([filteredSounds()[selected()]]);
    } else if(searchTerm().length > 0) {
      startPlaying(filteredSounds());
    }
  });

  createEffect(() => {
    if (selected() !== null) {
      document.querySelector(`.sound-button:nth-child(${selected() + 1})`).scrollIntoView({
        behavior: 'smooth',
        inline: 'nearest',
        block: 'nearest',
      });
    }
  })

  return (
    <div >
      <GlobalStyles />
      <SearchInputForm onSubmit={handleSubmit}>
        <SearchInput 
          onInput={handleInputChange} 
          value={searchTerm()} 
          placeholder="Suche" 
          ref={searchEl}
        />
      </SearchInputForm>
      <Box>
        <ButtonGrid>
          <For each={filteredSounds()} fallback={<div>Keine Sounds gefunden</div>}>
            {(sound, i) => {
              return <SoundButton class="sound-button" selected={() => selected() === i()} playing={playing} onClick={() => {
                startPlaying([sound]);
              }}>{sound.replace(/_/g, ' ')}</SoundButton>;
            }}
          </For>
        </ButtonGrid>
      </Box>
    </div>
  );
};
