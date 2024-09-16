import { moduleMetadata } from "@storybook/angular";
import { MusicButtonComponent } from "../../../shared/music-button/music-button.component";
import { SoundService } from "../../../shared/sound.service";
import { MainMenuComponent } from "../main-menu.component";

export default {
  title: 'Main Menu',
  component: MainMenuComponent,
  decorators: [
    moduleMetadata({
      declarations: [MusicButtonComponent],
      providers: [SoundService]
    })
  ]
}

const Template = (args: any) => ({
  component: MainMenuComponent,
  props: args,
})

export const Base = Template.bind({});

