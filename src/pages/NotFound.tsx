import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Page } from '@/components/Page';
import { PageHeader } from '@/components/PageHeader';
import { PixelScene } from '@/components/PixelScene';
import { CAMP_LABEL, campIsland } from '@/scene/island';
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

      <motion.div variants={fadeUp} className="mt-16">
        <PixelScene scene={campIsland} label={CAMP_LABEL} />
      </motion.div>
    </Page>
  );
}
