import React, { useState } from 'react'

import electra from 'assets/goddesses/electra.svg'
import lumina from 'assets/goddesses/lumina.svg'
import sonus from 'assets/goddesses/sonus.svg'
import chronis from 'assets/goddesses/chronis.svg'
import paper from 'assets/images/ui/backgrounds/paper_horizontal.png'
import { GoddessColumn } from './GoddessColumn'
import { classNames } from 'utils'
import Button from 'components/Button'

import electra_loop from 'assets/sound/electra.mp3'
import lumina_loop from 'assets/sound/lumina.mp3'
import sonus_loop from 'assets/sound/sonus.mp3'
import chronis_loop from 'assets/sound/chronis.mp3'
import Modal from 'components/Modal'
import { useAccount } from 'providers/AccountProvider'

const paragraphs = {
  [electra]: [
    'The Goddess Electra reigns supreme, embodying the essence of energy itself. Known as the Divine Engineer, Electra is revered by her followers for her pragmatic and logical mentality, akin to that of an engineer shaping the world with precision and purpose. Her dominion over electromagnetic waves grants her unparalleled power and influence, shaping the very fabric of existence.',
    'The religion dedicated to Electra is known as Electraism, and her followers are called Electrians. At the heart of Electraism lies the belief that energy is the driving force behind all creation and transformation. The Electrians view Electra as the architect of the universe, the one who harnessed the raw power of energy to bring forth life and shape the cosmos. They see her as the embodiment of innovation, progress, and the ordered flow of energy.',
    'As the patron of engineers, inventors, and scientists, Electra bestows upon her followers the gift of innovation and understanding. Electrians possess an innate affinity for technology and the manipulation of energy. They excel in the fields of engineering, mechanics, and electrical sciences, pushing the boundaries of what is possible through their devotion to Electra. Through her guidance, they unlock the secrets of energy, developing revolutionary inventions and groundbreaking discoveries.',
    'The powers granted by Electra to her followers are diverse and far-reaching. Electrians can harness and manipulate energy in various forms, ranging from electrical currents to electromagnetic radiation. They have the ability to generate and control lightning, channel energy to heal or enhance physical capabilities, and create protective barriers of electrified force. Some of the most skilled Electrians can even tap into the vast reserves of energy within the cosmos, unleashing devastating attacks or powering massive machinery.',
    'Among the creatures associated with Electra, there are the Emicore, beings of living radiation and energy. These radiant entities embody the purest essence of electromagnetic waves and serve as guardians of the sacred places dedicated to their divine patron. Emicore possess the ability to manipulate and shape energy, creating dazzling displays or blinding bursts of radiance to protect the sanctuaries of Electra.',
    'In the realm of Dutune, the followers of Electra, guided by her pragmatic and logical approach, strive to unlock the mysteries of energy and harness its power for the betterment of society. They are the architects of progress, driving innovation and technological advancements. Through their devotion to the Divine Engineer, the Electrians seek to illuminate the world with the brilliance of energy and create a future where the forces of nature and the ingenuity of mortals intertwine harmoniously.'
  ],
  [lumina]: [
    'Lumina, the Goddess of Light, radiates with unparalleled brilliance and splendor. Her divine essence is intricately woven into the waves of visible light, bestowing upon her followers the gift of illumination and enlightenment. Lumina embodies an aristocratic and proud disposition, reflecting her regal nature in every aspect of her worship and the demeanor of her devotees.',
    'The religion devoted to Lumina is known as Luminism, and her followers are called Luminarians. They believe that light is the essence of knowledge, truth, and enlightenment. Luminarians consider Lumina to be the supreme source of wisdom and the beacon that guides mortals through the darkness of ignorance. Her divine light is seen as the ultimate revelation, revealing hidden truths and illuminating the path to enlightenment.',
    'Distinctive features of Luminarians are their refined tastes and a deep appreciation for aesthetics. They value beauty, symmetry, and harmony in all aspects of life. Luminarians are often seen dressed in flowing robes of white and gold, adorned with intricate patterns reminiscent of refracted light. They carry ornate lanterns or wear jewelry embedded with precious gemstones that shimmer and reflect light, symbolizing their devotion to Lumina.',
    'Lumina grants her followers a myriad of powers associated with light and illumination. Luminarians possess the ability to manipulate and control light, shaping it to their will. They can create blinding flashes of brilliance or cloak themselves in shadows, moving unseen through the darkness. Luminarians are capable of projecting beams of light that can heal or purify, and they can generate illusions and illusions that deceive the senses. Some of the most skilled Luminarians can even tap into the inherent energy within light, channeling it to unleash devastating attacks or grant visions of the future.',
    'As the patron of scholars, philosophers, and artists, Lumina inspires creativity and intellectual pursuits. Luminarians excel in the realms of knowledge, seeking to unravel the mysteries of the world and expand the boundaries of understanding. They are poets, painters, architects, and scientists, using the power of light to create masterpieces and push the boundaries of their respective fields.',
    "Among the creatures associated with Lumina, there are the Luminari, beings of pure light and energy. These radiant entities embody the essence of Lumina's divine illumination, and they serve as guardians of the sacred places devoted to their goddess. Luminari possess the ability to manipulate and shape light, creating dazzling displays or blinding bursts of radiance to protect the sanctuaries of Lumina.",
    "In the realm of Dutune, Lumina's followers, inspired by her aristocratic disposition, strive for intellectual pursuits and seek enlightenment through the divine light she embodies. They are the seekers of truth, the custodians of knowledge, and the creators of beauty. Through their devotion to Lumina, the Luminarians seek to illuminate the world, dispelling ignorance and bringing forth a future bathed in the brilliance of divine understanding."
  ],
  [sonus]: [
    'Sonus, the Goddess of Sound, resonates with the harmonies and melodies that weave through the fabric of existence. Her divine essence is intricately linked to the vibrations of sound waves, bestowing upon her followers the gift of auditory perception and the power to harness the essence of sound itself. Sonus embodies a calm and serene disposition, ever in tune with the natural world and mortals, and stands as a guardian ready to defend them.',
    'The religion devoted to Sonus is known as Sonism, and her followers are called Sonites. They believe that sound is the essence of connection, harmony, and balance. Sonites consider Sonus to be the embodiment of the sacred symphony that unites all living beings and the world itself. They perceive the world as a grand composition, and Sonus is the conductor, guiding mortals towards harmony and defending the delicate balance of nature.',
    'Distinctive features of Sonites are their acute sense of hearing and their profound connection to the natural world. They possess a deep appreciation for the subtle nuances of sound and understand the power of its vibrations. Sonites often dress in flowing garments adorned with intricate patterns that depict waves of sound and musical notes. They carry small wind chimes or wear delicate earrings that tinkle softly, symbolizing their devotion to Sonus.',
    'Sonus grants her followers a host of powers associated with sound and harmony. Sonites possess the ability to manipulate and control sound waves, utilizing them for defensive purposes. They can create sonic barriers to shield themselves and others, harmonize their surroundings to calm or pacify, or unleash powerful sonic blasts to repel adversaries. Sonites are also gifted with heightened senses, able to detect even the faintest of sounds and vibrations, granting them an advantage in perception and situational awareness.',
    'As the patron of nature, healers, and peaceful communities, Sonus inspires harmony and unity. Sonites are often found in roles such as healers, herbalists, and caretakers of sacred groves. They possess an innate understanding of the natural world and use sound as a tool for healing and restoration. Sonites are also peacemakers, mediating conflicts and striving for reconciliation, seeking to maintain balance and harmony within their communities.',
    'Among the creatures associated with Sonus, there are the Harmonics, creatures born from the very essence of sound. These beings embody the harmonious vibrations of Sonus and serve as guardians of the natural world. Harmonics possess the ability to manipulate sound, bending it to their will, and they use their powers to defend the delicate balance of nature against those who seek to disrupt it. They can create powerful sonic harmonies that resonate with the core of their opponents, disorienting and immobilizing them.',
    "In the realm of Dutune, Sonus' followers, guided by her calm and harmonious disposition, strive for unity and balance. They are the listeners, the healers, and the protectors of nature's delicate symphony. Through their devotion to Sonus, the Sonites seek to maintain the harmony of the world, defending it from disharmony and discord. They believe that by attuning themselves to the vibrations of sound, they can bring peace and serenity to a world in need of balance."
  ],
  [chronis]: [
    'Chronis, the Goddess of Time, reigns supreme over the ebb and flow of temporal existence. Her power and essence derive from the mesmerizing dance of gravitational waves, an ethereal force that ripples through the fabric of reality, shaping the perception and flow of time itself. Chronis emanates an aura of mysticism, her very presence a testament to the enigmatic nature of temporal manipulation.',
    "The religion that revolves around Chronis is known as Chronism, and her devoted followers are called Chronists. They perceive time as a vast and intricate tapestry, interwoven by the subtle interplay of gravitational waves under Chronis' watchful gaze. Chronists believe that time is not a linear progression but a complex symphony of cosmic forces, orchestrated by the divine hand of Chronis. They seek to understand the nature of time and unravel its mysteries, delving into the depths of scientific inquiry and speculation.",
    'Distinctive features of Chronists lie in their insatiable thirst for knowledge and their affinity for scientific inquiry. They are scholars, philosophers, and explorers of the mind. Chronists often don enigmatic attire, adorned with celestial motifs and intricate patterns that reflect the cosmic dance of gravitational waves. They carry with them timepieces of exquisite craftsmanship, meticulously crafted to resonate with the subtle rhythms of time. These artifacts serve as both symbols of devotion and practical tools for temporal exploration.',
    'Chronis bestows upon her followers an array of powers that are rooted in the manipulation of time and the understanding of gravitational waves. Chronists possess the ability to perceive temporal distortions and fluctuations, allowing them to navigate the intricacies of the temporal landscape. They can harness the power of gravitational waves to slow or hasten the flow of time within a localized area, granting them a temporal advantage in various situations. Chronists are also adept at sensing temporal anomalies and can shield themselves and others from their disruptive effects.',
    'As the patron of thinkers, scientists, and those who ponder the mysteries of existence, Chronis inspires intellectual exploration and scientific digression. Chronists excel in fields such as astronomy, quantum physics, and temporal engineering. They strive to comprehend the complex interplay between gravitational waves and the fabric of time, pushing the boundaries of knowledge and challenging the limits of mortal understanding.',
    'Among the creatures associated with Chronis, there are the Chronarchs, celestial beings that exist beyond the constraints of linear time. These majestic entities possess an intimate understanding of gravitational waves and their influence on temporal reality. Chronarchs can manipulate the very fabric of time, bending it to their will and using its power to defend the delicate balance of temporal existence. They can create temporal eddies to disorient adversaries, weave temporal shields to protect themselves and others, and even project ripples of gravitational waves to disrupt the flow of time around them.',
    "In the realm of Dutune, Chronis' followers, guided by her mysterious and enigmatic nature, seek to unravel the secrets of time itself. They are the custodians of knowledge, the guardians of temporal harmony, and the explorers of the unknown. Through their unwavering devotion to Chronis, the Chronists strive to unlock the mysteries of gravitational waves and the profound influence they have on the perception and flow of time. In their quest for understanding, they illuminate the path for all who dare to delve into the boundless depths of temporal manipulation."
  ]
}

const goddessMapping: Record<string, number> = {
  Electra: 0,
  Lumina: 1,
  Sonus: 2,
  Chronis: 3
}

export const GoddessSelectionView: React.FC = () => {
  const { sdk, signTransactions, sendTransactions } = useAccount()
  const [selected, setSelected] = useState<string | undefined>()
  const [modalOpen, setModalOpen] = useState(false)

  const select = (goddess: string) => () => {
    setSelected(goddess)
  }

  const cancelSelection = () => {
    setSelected(undefined)
  }

  const openModal = () => {
    setModalOpen(true)
  }

  const choose = async () => {
    if (selected && Object.keys(goddessMapping).includes(selected)) {
      const signed = await signTransactions([
        await sdk.game.PLAYER_commenceAction(goddessMapping[selected])
      ])
      sendTransactions(
        signed[0],
        `Pleding allegiance to ${selected}...`,
        'Your choice was accepted!'
      )
    }
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4">
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="relative flex justify-center">
          <div className="z-10 flex flex-col items-center justify-center space-y-6 p-4 text-center">
            <div className="w-80 pb-4">
              <h1 className="font-fantasy text-stroke text-3xl font-bold">
                Are you sure?
              </h1>
              <div className="rounded-lg bg-black bg-opacity-80 p-2 font-bold">
                Deity choice is permanent. You will not be able to change your
                allegiance afterwards.
              </div>
            </div>
            <Button onClick={choose}>Choose {selected}</Button>
          </div>
          <img className="absolute z-0" src={paper} />
        </div>
      </Modal>
      <div
        className={classNames('absolute top-8 z-20', !selected && 'opacity-0')}
      >
        <Button onClick={cancelSelection}>Go back</Button>
      </div>
      <h1
        className={classNames(
          'font-fantasy pointer-events-none select-none text-6xl',
          selected && 'opacity-10'
        )}
      >
        Pledge your allegiance, mortal
      </h1>
      <div className="flex h-full w-full max-w-screen-2xl items-start transition-all">
        <GoddessColumn
          image={electra}
          name={'Electra'}
          title={'The pulsing heartbeat of Energy'}
          onSelect={select('Electra')}
          onChoice={openModal}
          selected={selected}
          paragraphs={paragraphs[electra]}
          sound={electra_loop}
        />
        <GoddessColumn
          image={lumina}
          name={'Lumina'}
          title={'The radiant beacon of Light'}
          onSelect={select('Lumina')}
          onChoice={openModal}
          selected={selected}
          paragraphs={paragraphs[lumina]}
          sound={lumina_loop}
        />
        <GoddessColumn
          image={sonus}
          name={'Sonus'}
          title={'The harmonious whisper of Sound'}
          onSelect={select('Sonus')}
          onChoice={openModal}
          selected={selected}
          paragraphs={paragraphs[sonus]}
          sound={sonus_loop}
        />
        <GoddessColumn
          image={chronis}
          name={'Chronis'}
          title={'The ever-ticking mistress of Time'}
          onSelect={select('Chronis')}
          onChoice={openModal}
          selected={selected}
          paragraphs={paragraphs[chronis]}
          sound={chronis_loop}
        />
      </div>
    </div>
  )
}
