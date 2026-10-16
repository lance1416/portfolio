import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { boxStyle, HiddenCat } from '@/components/HiddenCat';
import { Page } from '@/components/Page';
import { PageHeader } from '@/components/PageHeader';
import {
  PixelScene,
  SCENE_DISSOLVE,
  SCENE_FRAME,
} from '@/components/PixelScene';
import {
  CAT_BOX,
  SIGNPOST_LABEL,
  SIGNS,
  signBox,
  signpost,
} from '@/scene/signpost';
import { fadeUp } from '@/utils/variants';

export default function NotFound() {
  return (
    <Page>
      {/* The ghost number reads 404, so the title can say it in words */}
      <PageHeader chapter="§ 404" title="Page not found" />

      <motion.div variants={fadeUp}>
        <p className="text-lead">There's nothing at this address.</p>
        <Link to="/" viewTransition className="btn-primary mt-8">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to home
        </Link>
      </motion.div>

      {/* The signpost's boards are real links to the pages they name. */}
      <motion.div variants={fadeUp} className="relative mt-16">
        <PixelScene
          scene={signpost}
          label={SIGNPOST_LABEL}
          className={SCENE_FRAME}
          dissolve={SCENE_DISSOLVE}
        />
        {SIGNS.map((sign) => (
          <Link
            key={sign.to}
            to={sign.to}
            viewTransition
            aria-label={`Go to ${sign.name}`}
            style={boxStyle(signBox(sign))}
            // On phones a board is ~15px tall: the pseudo-element stretches
            // its hit area to ~40px (the boards' arrows point apart, so the
            // stretched areas barely meet).
            className="absolute rounded-sm transition-colors after:absolute after:inset-x-0 after:-inset-y-3 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:after:inset-y-0"
          />
        ))}
        <HiddenCat spot="notFound" box={CAT_BOX} />
      </motion.div>
    </Page>
  );
}
