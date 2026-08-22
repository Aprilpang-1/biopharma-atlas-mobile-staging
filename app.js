// Phase 7: NYC-subway-style redesign. All lines are routed on strict
// 0/45/90-degree segments only (octilinear routing, like Jug Cerovic's
// INAT-style transit maps) so the map reads as a real metro diagram.

const SVG_NS = "http://www.w3.org/2000/svg";

// Hand-tuned layout - station positions are presentational, not content,
// so they live here rather than in content.json.
const DESKTOP_LAYOUT = {
  // widened on the right to give Vaccines/Infectious Disease its own open
  // column (x:1350-1550) - it's the one fully green-field area with no
  // interchanges into the existing network, so it doesn't need to route
  // around anything else. Extra width beyond the column itself is for its
  // long full-name legend ("Vaccines / Infectious Disease"), which needs
  // more horizontal room than any other area label on this map.
  // Heightened to fit Ophthalmology's new 2x2 station grid, plus the
  // bottom-left corner legend box below it.
  // Widened left (-160 -> -250) so ARNI (Heart Failure)'s label has real
  // room instead of crowding the frame border. Heightened further at the
  // top (-50 -> -70) so Cardiovascular's line can move up again (y:-20 ->
  // y:-55) while Vaccines/Infectious Disease's own top run drops low
  // enough (y:55 -> y:15) to clear JAK/Integrin/FcRn Inhibitor's label
  // text, not just their dots - the two lines still keep a healthy ~70
  // unit gap between them.
  // 2026-08-03: widened top/right/bottom margins (top 15->70, legend-to-
  // right-edge 20->100, legend-to-bottom-edge 10->90 units) so the map and
  // legend box have visible breathing room now that the black frame is
  // gone; left margin left unchanged since it was already comfortable.
  viewBox: "-250 -125 2230 1225",
  linePaths: {
    // small notches at each multi-tone stop (Targeted mAb, ADC, Bispecific
    // Ab) so the line visibly crosses its own color dot within the pill
    // marker instead of the pill's generic center
    // Targeted mAb reorder: Oncology is now the middle (3rd) dot at
    // y:180 - exactly the pill's own center. ADC and Bispecific Ab's own
    // station centers are now offset (see stationPos) so Oncology's dot
    // lands on y:180 in every one of these pills too - the entire row
    // from Targeted mAb to Radioligand Therapy is one perfectly straight
    // line with zero notches.
    oncology: "60,180 1140,180",
    // runs parallel to (just above) Oncology from Targeted mAb to ADC -
    // both are genuine interchanges. Offset (12px, matching the standard
    // tone spacing) chosen to match the visible gap between parallel lines
    // on the NYC subway map reference - then dips down to actually touch
    // the ADC dot before turning up (JAK Inhibitor sits right at that
    // right-angle corner), then straight across through the rest.
    // Targeted mAb reorder: Immunology is now the 2nd dot at y:168, so the
    // line starts directly at its own dot instead of jogging up to it.
    // ADC's own center moved to y:174 (see stationPos) so Immunology's dot
    // there (tone0, the -6 offset) lands exactly on y:168 - the same
    // height as this line's own corridor - so the approach from Targeted
    // mAb is one continuous straight run with no dip needed at all; the
    // turn up toward JAK Inhibitor happens right at the dot, hidden under
    // the pill's opaque fill either way.
    immunology: "60,168 220,168 220,80 440,80 440,74 480,74 480,80 820,80 1000,80",
    // pure right-angle (Manhattan) staircase - no diagonals. ASO sits
    // directly under RNAi Therapeutics (same x), Enzyme Replacement sits
    // where ASO used to be, and AAV anchors the line below Enzyme
    // CRISPR sits on the same horizontal run as RNAi Therapeutics - no
    // right-angle turn at the end, just a straight continuation. Small
    // vertical notches at AAV, ASO, RNAi Therapeutics and CRISPR line it
    // up with its own dot's offset at each of those four interchanges
    // Rare Disease is now the bottom dot at RNAi Therapeutics (offset
    // +12 = y:426), so the vertical approach stops there instead of
    // continuing up to CRISPR's own offset (414) while still inside/
    // exiting the pill - that made the line's visible exit height match
    // Metabolic's dot (414) instead of its own. The transition to CRISPR's
    // offset now happens in the open gap between the two stations instead.
    // The turn from vertical to horizontal now happens early, at x:700 -
    // well clear of the pill - instead of right at the dot. That leaves a
    // long straight 200px run at y:426 that passes directly THROUGH the
    // dot as a plain interior point, with no corner-rounding at all right
    // at the touch point. A rounded corner (even a tight one) never
    // actually reaches its own vertex when turning 90 degrees, so no
    // amount of tightening the old turn-at-the-dot approach could fully
    // close the visual gap the pill's opaque fill leaves between the dot
    // and the resuming line - a straight pass-through has no such gap.
    // ASO touch was missing entirely - the old y:534 run only reached
    // x:700 before turning up, 80px short of ASO's own x:780, leaving that
    // dot completely disconnected from the line. Fixed by extending the
    // run out past ASO to x:830 (comfortably clear of its pill) before
    // doubling back to the same x:700 turn-up point that already gives
    // RNAi Therapeutics its clean pass-through - x:780 is now crossed
    // twice as a plain straight interior point (no rounding vertex sits
    // anywhere near it), so it's a genuine unrounded touch in both
    // directions, same technique as the parallel-line notches at ADC/
    // Bispecific Ab.
    "rare-disease": "480,762 480,540 480,534 830,534 700,534 700,426 900,426 900,414 960,414",
    // aligned straight down from Targeted mAb (same x) to GLP-1, forming a
    // T-junction there: a spur left to SGLT2 Inhibitor, then straight
    // across to the right through the rest of the line to Rare Disease
    // (rnai-therapeutics). Starts at Targeted mAb's own dot offset and
    // notches down to SGLT2's
    // Whole row (GLP-1, THR-beta Agonist, Insulin, RNAi Therapeutics) now
    // lives at y:414 - the same height as SGLT2's own offset dot - so the
    // descent from Targeted mAb lands directly on GLP-1, the SGLT2 spur
    // touches its dot with no dip at all, and the line runs straight
    // through to RNAi with zero jogs anywhere in between.
    // The SGLT2 hairpin now overshoots 8px past the dot (to x:-88) before
    // returning, instead of turning exactly at the dot (x:-80). A rounded
    // hairpin's visible curve only ever reaches halfway between its cut
    // points and the true corner, so turning AT the dot always fell short
    // and only grazed the pill's border - overshooting past the dot moves
    // that same shortfall past the point where it actually matters.
    metabolic: "60,204 60,414 -66,414 -88,414 -66,414 60,414 420,414 620,414 780,414",
    // Neuro touches two Rare Disease interchanges - ASO from the right
    // (spike out-and-back, same pattern as the Metabolic/SGLT2 spur) and
    // AAV from the right along the same row - without crossing either of
    // Rare Disease's own segments. Anti-CGRP Therapy sits right at the
    // T-junction where the spike branches off. Small notches align the
    // ASO and AAV touches with this line's own dot offset at each
    // ASO hairpin overshoots 10px past the dot (to x:770 instead of x:780)
    // so the curve's actual peak - which for a long symmetric hairpin like
    // this lands exactly 10px short of the vertex, per the roundedPathD
    // rounding math - reaches the true dot instead of stopping short of it.
    neuro: "1200,400 1200,540 1200,546 770,546 1200,546 1200,774 480,774",
    // redesigned onto its own dedicated column (x:-120, one full step left
    // of Metabolic's SGLT2 spur at x:-80) so it never runs alongside
    // Metabolic's line for any stretch - it only ever touches SGLT2 and
    // Targeted mAb via short spurs from the opposite side (mirroring
    // Metabolic's own spurs). From Targeted mAb it climbs to an open
    // corridor along the very top of the map (y:20, above Immunology's
    // row) and travels all the way across to RNAi Therapeutics, dropping
    // down to touch it from above - never running along Metabolic's own
    // y:420 row the way the old design did
    // notches to its own dot offset at both SGLT2 and Targeted mAb, and
    // ends at RNAi Therapeutics' offset instead of the pill's center - the
    // final approach shifts to x:770 (10px left of the pill's own x:780)
    // so this vertical run doesn't parallel-overlap Rare Disease's own
    // vertical approach into the same pill from x:780 above it, only
    // rejoining x:780 in a short final step that's hidden under the pill
    // dedicated column at x:-150. SGLT2 touch is a straight horizontal
    // out-and-back hairpin (matching Metabolic's own successful pattern)
    // with a 70px leg - long enough that the 20px corner-rounding only
    // "bulges" the last third of the approach out to the dot, instead of
    // consuming the whole leg into a tight closed loop like a 40px leg did
    // final target 780,402 matches Cardiovascular's own offset now that
    // RNAi Therapeutics' center moved from y:420 to y:414
    // Same overshoot fix as Metabolic's SGLT2 hairpin, mirrored: extends
    // 8px past the dot (to x:-72) before returning to the -150 column.
    // Targeted mAb touch redone as a short cut/overshoot spur (matching the
    // SGLT2 hairpin pattern exactly) instead of turning directly at the
    // dot's own coordinate - the old version cut the corner short (peak
    // only reached the pill's raw left border, not the dot itself, leaving
    // a visible gap). Cut point at x:30, vertex overshoots to x:70 (10px
    // past the dot at x:60) so the curve's actual deepest reach lands
    // exactly on the dot.
    // top run raised again, y:-20 to y:-55, so it stays well clear of
    // Vaccines/Infectious Disease's line even after ID's own run drops to
    // y:15 to clear the blue Immunology line's label text (see below)
    cardiovascular: "0,780 0,700 0,600 -150,600 -150,426 -94,426 -72,426 -94,426 -150,426 -150,192 30,192 70,192 30,192 -150,192 -150,-55 700,-55 700,250 780,250 780,402",
    // 2x2 grid: Complement Inhibitor sits left of AAV (same row), Anti-VEGF
    // sits directly under AAV (same column), Dry Eye Immunomodulator
    // mirrors that directly under Complement Inhibitor - a simple loop
    // through all four corners. Small notch aligns the AAV touch with
    // this line's own dot offset within that 4-way pill
    // Ophthalmology is now tone3 at AAV (y:798, swapped with Hematology)
    // Complement Inhibitor (Geographic Atrophy)'s dot moved from y:780 to
    // y:830 (see stationPos) - it sat only 6 units from Hematology's
    // horizontal run at y:786, nearly touching a line that isn't even its
    // own. Moved it DOWN rather than up so it doesn't run into April's own
    // hand-placed label for this station (pinned around y:746 on the pptx,
    // already sitting above the old dot position). The path now dips down
    // to 830 first, then still climbs to 798 to enter AAV's pill at
    // Ophthalmology's own tone offset (unrelated to Hematology).
    ophthalmology: "350,900 350,830 350,798 480,798 480,900",
    // runs along the open bottom strip (y:830) and spikes up to touch each
    // of its three interchanges from below - the one direction still open
    // on all three (Bispecific Ab from above/oncology, CRISPR Gene Editing
    // from above/left via Rare Disease, AAV from above/left/right via Rare
    // Disease, Neuro and Ophthalmology already). The long run to Bispecific
    // Ab is offset to x:395 (not 420) so it doesn't coincide with Thr-Beta
    // Agonist's dot, only jogging over to touch the real station at the end.
    // Each spike/touch lands at this line's own dot offset, not the
    // pill's generic center
    // CRISPR touch hairpin overshoots 10px past the dot (to y:416 instead
    // of y:426) - same rounding-shortfall fix as the ASO hairpin above.
    // Same technique as Oncology's straight run through Targeted mAb/ADC/
    // Bispecific Ab: instead of detouring to touch a dot that's offset
    // from this line's own height, move the CONNECTING station (PNH) so
    // the dot IS this line's own height. PNH shifted from y:830 to y:786
    // (see stationPos) - AAV's Hematology dot is already at y:786 (tone2
    // of the swapped order), so with PNH matching too, the entire PNH-
    // CRISPR-AAV stretch is one uninterrupted straight run at y:786, with
    // zero notch or detour anywhere - a genuinely straight line crossing
    // the dot, not an approximation of one.
    // vertical run moved from x:395 to x:240 (the midpoint between GLP-1
    // Receptor Agonist at x:60 and THR-beta Agonist at x:420) - x:395 was
    // only ~85-115 units from Enzyme Replacement Therapy's/Antifibrotic's
    // label text at their real rendered width, close enough to overlap it
    hematology: "1050,786 960,786 960,416 960,786 240,786 240,260 420,260 420,192",
    // drops straight down from Anti-Cytokine mAb, jogging right through
    // the narrow gap between Bispecific Antibody's and Cell Therapy's
    // labels (x:490-520) to reach CFTR Modulator, then continues straight
    // down the same open column to the two new stations below. Starts at
    // Anti-Cytokine mAb's own dot offset
    respiratory: "460,86 460,100 500,100 500,300 500,500 500,650",
    // Targeted mAb reorder: Infectious Disease is now the topmost dot at
    // y:156, and the top of the pill is now open (Immunology and Oncology
    // both run straight out to the right at their own heights,
    // Cardiovascular passes straight through, Metabolic drops straight
    // down) - so the line runs straight up from its own dot instead of a
    // 45-degree diagonal, then across the open top corridor (y:35, just
    // under Cardiovascular's own y:20 corridor) to its own column. The
    // Targeted mAb badge and station label are shifted off this column
    // (see areaLabelPos.oncology and labelOffsetX["targeted-mab"]) so the
    // straight vertical run has the x:60 column to itself.
    // top run lowered further, y:55 to y:15 - the label text for JAK/
    // Integrin/FcRn Inhibitor (on the blue Immunology line) reaches down
    // to about y:56-70 above their own dots, so y:55 was still crossing
    // the bottom of that text, not just clearing the dots themselves
    "infectious-disease": "60,156 60,15 1450,15 1450,150 1450,350"
  },
  // Every badge is x-centered on the one station that anchors its end of
  // the line (its own unique terminus where possible), placed above or
  // below depending on which side has open space.
  // Positions below are April's own final badge placements from the
  // editable-labels pptx (through v23) - e.g. Oncology's badge moved to
  // sit beside Radioligand Therapy at the line's right end, and Vaccines/
  // Infectious Disease's badge moved down near Direct-Acting Antiviral.
  areaLabelPos: {
    oncology: { x: 1173, y: 182 },
    immunology: { x: 1034, y: 91 },
    "rare-disease": { x: 959, y: 336 },
    metabolic: { x: -80, y: 332 },
    neuro: { x: 1202, y: 333 },
    cardiovascular: { x: 0, y: 858 },
    ophthalmology: { x: 480, y: 930 },
    hematology: { x: 1050, y: 826 },
    respiratory: { x: 500, y: 678 },
    "infectious-disease": { x: 1450, y: 382 }
  },
  stationPos: {
    "targeted-mab": { x: 60, y: 180 },
    // Shifted 6px off the row's own y:180 so Oncology's dot (tone1, the
    // +6 offset) lands exactly on y:180 instead of y:186 - lets Oncology's
    // line run perfectly straight through this pill with zero notch.
    "adc": { x: 220, y: 174 },
    // Shifted the opposite direction (Oncology is tone0 here, the -6
    // offset) for the same reason - its dot also lands exactly on y:180.
    "bispecific-ab": { x: 420, y: 186 },
    "cell-therapy": { x: 600, y: 180 },
    "small-molecule": { x: 780, y: 180 },
    "checkpoint-inhibitor": { x: 960, y: 180 },
    "radioligand-therapy": { x: 1140, y: 180 },
    "anti-cytokine-mab": { x: 460, y: 80 },
    "jak-inhibitor": { x: 220, y: 80 },
    "gene-therapy-aav": { x: 480, y: 780 },
    "enzyme-replacement-therapy": { x: 480, y: 540 },
    "aso": { x: 780, y: 540 },
    // Metabolic's whole GLP-1-to-RNAi row sits at y:414 (SGLT2's own dot
    // offset), not the old y:420 - moved as a block so the entire line is
    // one uniform height with zero transition jogs anywhere, instead of
    // dipping to touch SGLT2's offset dot partway through. SGLT2 itself
    // stays at y:420 since that pill's own two dots are still +-6 from its
    // center regardless of what height lines approach it from.
    "rnai-therapeutics": { x: 780, y: 414 },
    "crispr-gene-editing": { x: 960, y: 420 },
    "glp1-agonist": { x: 60, y: 414 },
    "sglt2-inhibitor": { x: -80, y: 420 },
    "thr-beta-agonist": { x: 420, y: 414 },
    "insulin-analog": { x: 620, y: 414 },
    "integrin-inhibitor": { x: 820, y: 80 },
    "fcrn-inhibitor": { x: 1000, y: 80 },
    "anti-amyloid-mab": { x: 1200, y: 400 },
    "anti-cgrp-therapy": { x: 1200, y: 540 },
    "anticoagulant-doac": { x: 0, y: 780 },
    "arni-heart-failure": { x: 0, y: 700 },
    "complement-inhibitor-ga": { x: 350, y: 830 },
    "anti-vegf-therapy": { x: 480, y: 900 },
    "dry-eye-immunomodulator": { x: 350, y: 900 },
    // Shifted from y:830 to y:786 so Hematology's line runs straight
    // through here with no notch - see the hematology path comment
    "complement-inhibitor-pnh": { x: 1050, y: 786 },
    "cftr-modulator": { x: 500, y: 300 },
    "antifibrotic-ipf": { x: 500, y: 500 },
    "anti-tslp-biologic": { x: 500, y: 650 },
    "mrna-vaccine": { x: 1450, y: 150 },
    "antiviral-daa": { x: 1450, y: 350 }
  },
  // stations sitting where a straight-above label would cross the line -
  // render their label below the dot, or offset sideways, instead
  labelBelow: ["adc", "gene-therapy-aav", "aso", "anticoagulant-doac"],
  // Anti-CGRP Therapy sits right at a T-junction where a line runs
  // straight through above and below it (same x) - shift its label to the
  // open left side instead of the default above-the-dot placement, which
  // would sit right on top of the incoming vertical line
  // same 65px offset magnitude as GLP-1 Receptor Agonist uses to clear its
  // own T-junction's vertical line, mirrored to the left since Anti-CGRP's
  // line runs to its right instead of its left
  // AAV's label is shifted right, off its own x, to leave the space
  // directly below the dot open - that's where Hematology's line now
  // approaches from (the one side not already used by Rare Disease/
  // Neuro/Ophthalmology)
  // anti-vegf-therapy no longer needs an offset now that it's a clean
  // terminus under AAV rather than sitting at Cardiovascular's old T-junction
  // Respiratory's column (x:500) runs vertically through CFTR Modulator,
  // Antifibrotic, and Anti-TSLP - a horizontally-centered label on a
  // vertical line sits right on top of the line's continuing path, so
  // each is shifted sideways off it. Enzyme Replacement Therapy's own
  // label is wide enough to reach across into that same column from its
  // own dot 20px away, so it's shifted the other direction, clear of both
  // Respiratory's line and Hematology's line 85px to its other side.
  // 2026-07-31: overrides below re-derived from April's final hand-placed
  // positions in the editable-labels pptx (through v23) - each value ports
  // her exact on-slide label position back into the live map, replacing
  // the earlier hand-picked pins above.
  labelOffsetX: {
    "targeted-mab": -79,
    "jak-inhibitor": 5,
    "gene-therapy-aav": 79,
    "enzyme-replacement-therapy": -111,
    "rnai-therapeutics": 38,
    "crispr-gene-editing": 2,
    "sglt2-inhibitor": 4,
    "dry-eye-immunomodulator": -12,
    // 2026-08-02 (round 5): April clicked directly into each station
    // (not just its line) and found these 4 touching their own dot's
    // *selected*-state ring, which balloons to r:10 on click (CSS
    // .station-dot.selected) - a size none of the earlier passes
    // checked, since they only ever tested the resting r:6 dot.
    // Antifibrotic (IPF) also had its rare-disease-line gap tighten
    // further once the click-enlarged 21px font was factored in.
    "antifibrotic-ipf": 95,
    // 2026-08-01: label/line-proximity pass - see labelOffsetY comment
    // below for the fix rationale, applies equally to these X shifts.
    // 2026-08-02 (round 6): re-checking with a corrected overlap test (see
    // complement-inhibitor-pnh note below) found "(Kinase Inhibitor)" was
    // actually being sliced straight through by Cardiovascular's own
    // vertical line at x:700 - every earlier pass missed this because it
    // only ever measured distance to the box's corners/edges, never
    // checked whether a line ran straight through the box's interior.
    // Shifted right, clear of x:700, rather than left (would need a much
    // bigger move to clear the line on that side instead).
    // 2026-08-02 (round 7): back to 0 - April had the label dropped down to
    // just "Kinase" / "Inhibitor" (no more "Small Molecule" wording, see
    // wrapLabel's special case) and centered on its own dot, which is
    // narrow enough now to clear the CV line, the Checkpoint Inhibitor
    // label to its right, and the Cell Therapy label to its left, all at
    // once without needing any horizontal shift.
    "small-molecule": 0,
    "anti-cytokine-mab": -44,
    // 2026-08-01 (round 2): April found more label/line collisions by
    // eye after the first pass, this time including a few where the
    // squeeze is against the station's own connecting line running
    // parallel past the label (not just an unrelated line), or against a
    // nearby area badge rather than a line at all. Re-ran the same
    // bounding-box check, this time also checking against every area
    // badge's circle and each label's own connecting line beyond the
    // small radius immediately at the dot.
    // 2026-08-02 (round 6): 0 - now that the label is split into 3 short
    // rows (see wrapLabel's special case + labelOffsetY note below), a
    // centered position clears Hematology's own vertical line on both
    // sides with margin, no horizontal shift needed at all.
    "complement-inhibitor-pnh": 0,
    "anti-amyloid-mab": -33,
    "mrna-vaccine": -89,
    "antiviral-daa": -91,
    "radioligand-therapy": 0,
    "glp1-agonist": 90,
    "arni-heart-failure": -117,
    "anticoagulant-doac": -57,
    // 2026-08-01 (round 3): re-ran the same check against ALL 33 stations
    // (not just the ones April had screenshotted) at the enlarged
    // "selected" 21px size, since that's the size shown in her
    // screenshots - this size hadn't been swept map-wide before. Found 8
    // more stations tight against their own badge or line at that size.
    "anti-tslp-biologic": 69,
    "insulin-analog": 15,
    "thr-beta-agonist": -13,
    "anti-cgrp-therapy": 69,
    "cftr-modulator": 101,
    "anti-vegf-therapy": 70,
    "fcrn-inhibitor": 1,
    "complement-inhibitor-ga": -138,
    // 2026-08-02 (round 4): three more from April's own review, plus ADC
    // which round 3's map-wide sweep had missed (its "own dot" check used
    // a generic small radius instead of the pill's real, larger half-
    // height, so it didn't register ADC sitting right on the pill's own
    // border - fixed the check and re-verified here). GLP-1 Receptor
    // Agonist is a tight case: at the enlarged size the label is almost
    // exactly as wide as the gap between Metabolic's own vertical line and
    // a distant Hematology vertical it happens to run past, so it's
    // centered in that gap rather than fully clear on both sides -
    // confirmed by render that this reads fine (Hematology's segment
    // there is thin and unfocused in this line's own zoomed view).
    "adc": 0
  },
  // CRISPR's label centered directly under the Rare Disease legend, 50px
  // gap between them (legend y:290, label default would land at y:360 -
  // pulled up by 20 to land at 340)
  labelOffsetY: {
    "targeted-mab": 38,
    "anti-cytokine-mab": 17,
    "integrin-inhibitor": 5,
    "gene-therapy-aav": -12,
    "enzyme-replacement-therapy": 16,
    "rnai-therapeutics": 102,
    "crispr-gene-editing": 7,
    "sglt2-inhibitor": 4,
    "dry-eye-immunomodulator": 89,
    "antifibrotic-ipf": 28,
    // 2026-08-02 (round 7): -8 - small nudge up off the dot now that the
    // label is just two short rows ("Kinase" / "Inhibitor") sitting
    // centered on top of it, clear of the CV line and both neighboring
    // stations' labels.
    "small-molecule": -8,
    // 2026-08-01: label/line-proximity pass - April flagged RNAi
    // Therapeutics and ASO sitting too close to a passing line when their
    // line is zoomed in (font-size grows to 19/21px but the label's
    // position doesn't otherwise move). A systematic check (label
    // bounding box vs. every line segment, at both resting 16px and
    // zoomed 19px sizes, minus the line's actual drawn stroke width)
    // found 8 stations with a real or near-real collision; each entry
    // above/below marked with this date nudges that station's label just
    // far enough from its nearest line to clear it with margin, re-verified
    // with the same check plus a visual render.
    "aso": 2,
    // 2026-08-01 (round 2): see matching comment in labelOffsetX above -
    // this second pass also checks each label against every area badge
    // circle and against its own connecting line beyond the immediate
    // dot vicinity, which is what catches cases like mRNA Vaccine (its
    // own vertical line runs right past the label, not just near the dot)
    // and Anti-Amyloid mAb (squeezed between its area badge above and its
    // own dot below).
    // 2026-08-02 (round 6): unchanged from round 5's -17 - only offsetX
    // and the wrapLabel split changed for this station this round.
    "complement-inhibitor-pnh": -17,
    "anti-amyloid-mab": 15,
    "mrna-vaccine": 23,
    "antiviral-daa": 29,
    "jak-inhibitor": -6,
    "radioligand-therapy": -12,
    "glp1-agonist": 0,
    "arni-heart-failure": 30,
    "anticoagulant-doac": 12,
    // 2026-08-01 (round 3): see matching comment in labelOffsetX above.
    "anti-tslp-biologic": 29,
    "insulin-analog": 0,
    "thr-beta-agonist": -7,
    "anti-cgrp-therapy": 36,
    "cftr-modulator": 25,
    "anti-vegf-therapy": 42,
    "fcrn-inhibitor": -10,
    "complement-inhibitor-ga": 38,
    // 2026-08-02 (round 4): see matching comment in labelOffsetX above.
    // ARNI also got a Y change here, not just X - previously placed
    // "above" its dot via the default clearance formula, now shifted down
    // so the two-line label's vertical center roughly lines up with the
    // dot's own y instead, per April's request to align it horizontally
    // with the station rather than stacking above it.
    "adc": 8
  },
  // For stations where a real line's connection to its own dot would
  // otherwise be fully hidden under the pill's opaque white fill, redraw
  // that hidden stretch as a dashed line in the matching color so the
  // connection is visible instead of leaving a blank gap. Each entry is
  // {toneIndex, sides} - toneIndex matches the dot's position in that
  // modality's areas array (0-based), sides is which pill edge(s) that
  // line's dashed stretch should reach (a dot a line only terminates at
  // needs one side; a dot a line passes through needs both).
  pillCrossings: {
    "rnai-therapeutics": [
      { toneIndex: 0, sides: ["top"] },    // Cardiovascular enters from above
      { toneIndex: 1, sides: ["left"] },   // Metabolic enters from the left
      { toneIndex: 2, sides: ["left", "right"] } // Rare Disease passes through
    ],
    "sglt2-inhibitor": [
      { toneIndex: 0, sides: ["right"] },  // Metabolic's hairpin approaches from the right
      { toneIndex: 1, sides: ["left"] }    // Cardiovascular's hairpin approaches from the left
    ],
    "targeted-mab": [
      { toneIndex: 0, sides: ["top"] },    // Infectious Disease exits straight up
      { toneIndex: 1, sides: ["right"] },  // Immunology exits straight right
      { toneIndex: 2, sides: ["right"] },  // Oncology exits straight right
      { toneIndex: 3, sides: ["left"] },   // Cardiovascular's hairpin approaches from the left
      { toneIndex: 4, sides: ["bottom"] }  // Metabolic exits straight down
    ],
    "adc": [
      { toneIndex: 0, sides: ["left", "top"] }, // Immunology enters from the left corridor, exits up toward JAK Inhibitor
      { toneIndex: 1, sides: ["left", "right"] } // Oncology passes through
    ],
    "bispecific-ab": [
      { toneIndex: 0, sides: ["left", "right"] }, // Oncology passes through
      { toneIndex: 1, sides: ["bottom"] }  // Hematology enters from below
    ],
    "crispr-gene-editing": [
      { toneIndex: 0, sides: ["left"] },   // Rare Disease enters from the left
      { toneIndex: 1, sides: ["bottom"] }  // Hematology's hairpin approaches from below
    ],
    "aso": [
      { toneIndex: 0, sides: ["left", "right"] }, // Rare Disease passes through
      { toneIndex: 1, sides: ["right"] }   // Neuro's hairpin approaches from the right
    ],
    "gene-therapy-aav": [
      { toneIndex: 0, sides: ["top"] },    // Rare Disease exits straight up (terminus)
      { toneIndex: 1, sides: ["right"] },  // Neuro enters from the right (terminus)
      { toneIndex: 2, sides: ["left", "right"] }, // Hematology passes straight through, same height as its own trunk
      { toneIndex: 3, sides: ["left", "bottom"] } // Ophthalmology turns here: in from the left, out the bottom
    ]
  }
  // interchange dot colors are now read directly from each modality's own
  // "areas" list in content.json (see buildMap) rather than a hand-
  // maintained cap-at-2 list here, so stations shared by 3+ lines show
  // every color instead of only the first two
};

// Mobile portrait layout (April's "make it vertical for phones" request,
// 2026-08-08). Same topology/interchanges as the desktop LAYOUT above, but
// re-routed top-to-bottom instead of left-to-right, with the same
// strict-right-angle routing style (see roundedPathD) - every line built
// and verified (during the sketch phase) to be axis-aligned with zero
// segment overlap between different lines, using small parallel offsets
// at shared hub-to-hub corridors, same convention as the desktop pill
// tone-dots. Station label positions here use the same above/below
// default as desktop for now - fine-tuning offsets happens in the QA pass
// (still to come), same as the desktop layout got after its own first cut.
// 2026-08-10: full "vertical-first" redesign (April's "9 out of 10 lines
// vertical" + "mimic Shanghai more, fewer turns, stagger AAV/ASO/CRISPR"
// requests). Replaces the old left-to-right-mirrored mobile routing above
// with a genuinely column-based layout: each area gets its own dedicated
// x-column reused across non-overlapping y-ranges, connections between
// columns take a single clean 45-degree diagonal ("kink") instead of a
// multi-segment jog, and AAV/ASO/CRISPR now sit at three different
// heights so Rare Disease flows straight through all three in one pass
// instead of spurring out and back. Generated from the approved sketch
// (build_vertical2.py) plus April's hand-placed label positions from her
// PPTX edit pass (diffed against the pptx's own default "centered above
// the dot" placement, then reconciled onto this file's real label-anchor
// formula below so the same relative nudge she made carries over exactly).
// Interchange pills are no longer a fixed-width vertical dot-stack - see
// pillGeometry below and the pill-rendering code in buildMap for the new
// horizontal dot-stacking this layout relies on.
const MOBILE_LAYOUT = {
  viewBox: "185.8 -295 673.4 1979",
  linePaths: {
    "oncology": "650,-235 650,-180 650,-100 650,-20 650,60 570,140 510,140 510,410 520,420 640,420",
    "immunology": "350,-155 350,-100 350,-20 350,60 430,140 490,140 490,390 460,420 340,420",
    "infectious-disease": "485,365 540,420 600,480 750,480 750,560",
    "cardiovascular": "420,165 420,220 420,300 420,360 480,420 480,670 490,680 490,890 480,900",
    "metabolic": "635,555 580,500 500,420 500,670 510,680 510,690 580,760 580,840 520,900 620,900",
    "respiratory": "360,365 360,420 360,490 350,500 350,580 350,660",
    "rare-disease": "500,845 500,900 500,1040 500,1170 490,1180 490,1230 420,1300 540,1420 600,1420",
    "neuro": "350,925 350,980 350,1080 450,1180 470,1180 470,1230 400,1300",
    "hematology": "660,365 660,420 660,1030 510,1180 510,1310 620,1420 620,1550 610,1560",
    "ophthalmology": "420,925 420,980 420,1080 520,1180 530,1180 530,1250 580,1300",
  },
  areaLabelPos: {
    "oncology": { x: 650, y: -235 },
    "immunology": { x: 350, y: -155 },
    "infectious-disease": { x: 485, y: 365 },
    "cardiovascular": { x: 420, y: 165 },
    "metabolic": { x: 635, y: 555 },
    "respiratory": { x: 360, y: 365 },
    "rare-disease": { x: 500, y: 845 },
    "neuro": { x: 350, y: 925 },
    "hematology": { x: 660, y: 365 },
    "ophthalmology": { x: 420, y: 925 },
  },
  stationPos: {
    "adc": { x: 500, y: 140 },
    "targeted-mab": { x: 500, y: 420 },
    "bispecific-ab": { x: 650, y: 420 },
    "anti-cytokine-mab": { x: 350, y: 420 },
    "sglt2-inhibitor": { x: 500, y: 680 },
    "rnai-therapeutics": { x: 500, y: 900 },
    "gene-therapy-aav": { x: 500, y: 1180 },
    "aso": { x: 410, y: 1300 },
    "crispr-gene-editing": { x: 610, y: 1420 },
    "checkpoint-inhibitor": { x: 650, y: -180 },
    "radioligand-therapy": { x: 650, y: -100 },
    "cell-therapy": { x: 650, y: -20 },
    "small-molecule": { x: 650, y: 60 },
    "integrin-inhibitor": { x: 350, y: -100 },
    "jak-inhibitor": { x: 350, y: -20 },
    "fcrn-inhibitor": { x: 350, y: 60 },
    "arni-heart-failure": { x: 420, y: 220 },
    "anticoagulant-doac": { x: 420, y: 300 },
    "mrna-vaccine": { x: 750, y: 480 },
    "antiviral-daa": { x: 750, y: 560 },
    "glp1-agonist": { x: 580, y: 500 },
    "thr-beta-agonist": { x: 580, y: 760 },
    "insulin-analog": { x: 620, y: 900 },
    "anti-tslp-biologic": { x: 350, y: 500 },
    "antifibrotic-ipf": { x: 350, y: 580 },
    "cftr-modulator": { x: 350, y: 660 },
    "enzyme-replacement-therapy": { x: 500, y: 1040 },
    "anti-amyloid-mab": { x: 350, y: 980 },
    "anti-cgrp-therapy": { x: 350, y: 1080 },
    "complement-inhibitor-pnh": { x: 610, y: 1560 },
    "complement-inhibitor-ga": { x: 420, y: 980 },
    "anti-vegf-therapy": { x: 420, y: 1080 },
    "dry-eye-immunomodulator": { x: 580, y: 1300 },
  },
  // 2026-08-10 (task #171, per April's "make sure no station label text is
  // touching or overlapping any line"): every value below (labelBelow,
  // labelOffsetX, labelOffsetY) was found by an automated solver, not by
  // eye. The solver measures each label's REAL rendered width (Helvetica
  // Bold metrics via string-pixel-width, matching this map's actual
  // font/weight/size) and checks it against every line segment on the map
  // (excluding only the short stretch of a station's OWN line right next
  // to its OWN marker, which is expected to sit close). For every station
  // where the previous position still touched a line, it grid-searched
  // offsetX/offsetY/labelBelow for the nearest configuration with zero
  // line overlaps, preferring to keep April's original left/right side
  // where a large-enough nudge on that same side existed. Re-verified
  // after applying: 0 label-vs-line overlaps and 0 label-vs-label overlaps
  // across all 33 stations (see solve_labels.js / check_collisions.js).
  labelBelow: [
    "anti-tslp-biologic", "antifibrotic-ipf", "antiviral-daa", "aso", "cell-therapy", "cftr-modulator", "checkpoint-inhibitor", "complement-inhibitor-pnh", "crispr-gene-editing", "dry-eye-immunomodulator", "enzyme-replacement-therapy", "fcrn-inhibitor", "gene-therapy-aav", "glp1-agonist", "integrin-inhibitor", "jak-inhibitor", "radioligand-therapy", "small-molecule", "targeted-mab"
  ],
  labelOffsetX: {
    "targeted-mab": -75,
    "bispecific-ab": -35,
    "anti-cytokine-mab": -15,
    "sglt2-inhibitor": 50,
    "rnai-therapeutics": -62.4,
    "gene-therapy-aav": 85,
    "aso": -40,
    "crispr-gene-editing": 65,
    "checkpoint-inhibitor": -80,
    "radioligand-therapy": 50,
    "cell-therapy": -50,
    "small-molecule": 35.4,
    "integrin-inhibitor": 34.8,
    "jak-inhibitor": 55,
    "fcrn-inhibitor": 80,
    "arni-heart-failure": -60,
    "anticoagulant-doac": -55,
    "antiviral-daa": -35,
    "glp1-agonist": 5,
    "thr-beta-agonist": 20,
    "insulin-analog": 125,
    "anti-tslp-biologic": -45,
    "antifibrotic-ipf": 45,
    "cftr-modulator": 35,
    "enzyme-replacement-therapy": 145,
    "anti-amyloid-mab": -55,
    "anti-cgrp-therapy": -55,
    "complement-inhibitor-pnh": -42.8,
    "complement-inhibitor-ga": -25,
    "anti-vegf-therapy": 125,
    "dry-eye-immunomodulator": 41.2,
  },
  labelOffsetY: {
    "adc": -10,
    "anti-cytokine-mab": -20,
    "aso": 40,
    "glp1-agonist": 50,
    "thr-beta-agonist": -30,
    "cftr-modulator": 10,
    "enzyme-replacement-therapy": 80,
    "complement-inhibitor-ga": -50,
  },
  // Per-interchange pill geometry for the new HORIZONTAL dot-stacking
  // (replaces the old fixed-20px-wide vertical stack): pillW/pillH size
  // the capsule marker, dotX gives each sharing line's own x-offset from
  // the station center (keyed by area id, not array index, so it's
  // immune to content.json's mod.areas ordering) - chosen so each dot
  // sits on the side its own line actually approaches from, per April's
  // "line must cross its own matching-color dot" principle.
  pillGeometry: {
    "adc": { pillW: 46, pillH: 26, dotX: { "immunology": -10, "oncology": 10 } },
    "targeted-mab": { pillW: 106, pillH: 26, dotX: { "immunology": -40, "cardiovascular": -20, "metabolic": 0, "oncology": 20, "infectious-disease": 40 } },
    "bispecific-ab": { pillW: 46, pillH: 26, dotX: { "oncology": -10, "hematology": 10 } },
    "anti-cytokine-mab": { pillW: 46, pillH: 26, dotX: { "immunology": -10, "respiratory": 10 } },
    "sglt2-inhibitor": { pillW: 46, pillH: 26, dotX: { "cardiovascular": -10, "metabolic": 10 } },
    "rnai-therapeutics": { pillW: 66, pillH: 26, dotX: { "cardiovascular": -20, "rare-disease": 0, "metabolic": 20 } },
    "gene-therapy-aav": { pillW: 86, pillH: 26, dotX: { "neuro": -30, "rare-disease": -10, "hematology": 10, "ophthalmology": 30 } },
    "aso": { pillW: 46, pillH: 26, dotX: { "neuro": -10, "rare-disease": 10 } },
    "crispr-gene-editing": { pillW: 46, pillH: 26, dotX: { "rare-disease": -10, "hematology": 10 } },
  },
  // Keyed by area id (not toneIndex) for the same order-independence
  // reason as pillGeometry.dotX above - each dot's dashed "hidden
  // segment" guide now draws vertically (top/bottom, to the dot's own x)
  // or horizontally (left/right, at the shared row y) depending on which
  // edge of the pill that line's real path geometrically exits through.
  pillCrossings: {
    "adc": {
      "oncology": ["bottom", "right"],
      "immunology": ["bottom", "left"],
    },
    "targeted-mab": {
      "oncology": ["right", "top"],
      "immunology": ["left", "top"],
      "infectious-disease": ["bottom"],
      "cardiovascular": ["bottom", "top"],
      "metabolic": ["bottom"],
    },
    "bispecific-ab": {
      "oncology": ["left"],
      "hematology": ["bottom"],
    },
    "anti-cytokine-mab": {
      "immunology": ["right"],
      "respiratory": ["bottom"],
    },
    "sglt2-inhibitor": {
      "cardiovascular": ["bottom", "top"],
      "metabolic": ["bottom", "top"],
    },
    "rnai-therapeutics": {
      "cardiovascular": ["top"],
      "metabolic": ["right", "top"],
      "rare-disease": ["bottom"],
    },
    "gene-therapy-aav": {
      "rare-disease": ["bottom", "top"],
      "neuro": ["bottom", "left"],
      "hematology": ["bottom", "top"],
      "ophthalmology": ["bottom", "left"],
    },
    "aso": {
      "rare-disease": ["bottom", "top"],
      "neuro": ["top"],
    },
    "crispr-gene-editing": {
      "rare-disease": ["left"],
      "hematology": ["bottom", "top"],
    },
  },
};

// Picked once at load time (not live-reactive on resize/rotate - a full
// relayout on every resize event would mean rebuilding the whole SVG
// mid-interaction, which is its own separate piece of work) based on the
// same 600px breakpoint the rest of the mobile CSS already uses (see
// style.css's @media (max-width:600px)).
const LAYOUT = (typeof window !== "undefined" && window.innerWidth <= 600)
  ? MOBILE_LAYOUT
  : DESKTOP_LAYOUT;

var state = {
  data: null,
  selectedArea: null,
  selectedStation: null,
  detailView: null,
  pinned: [],
  comparing: false,
  // Current rotation (degrees) of the mobile beta-barrel visual - persists
  // across selections/rebuilds so rotating, then tapping a station, doesn't
  // snap the barrel back to its start position. Unused outside wheel mode.
  barrelRotation: 10
};

function isPinned(modId) {
  return state.pinned.indexOf(modId) !== -1;
}

function togglePin(modId) {
  var idx = state.pinned.indexOf(modId);
  if (idx !== -1) {
    state.pinned.splice(idx, 1);
  } else {
    state.pinned.push(modId);
    if (state.pinned.length > 2) state.pinned.shift();
  }
  updateCompareButton();
  if (!state.comparing) renderDetailPanel();
}

function updateCompareButton() {
  var btn = document.getElementById("compare-btn");
  var countEl = document.getElementById("compare-count");
  countEl.textContent = state.pinned.length;
  btn.classList.toggle("hidden", state.pinned.length < 2);
}

// 2026-08-02: for a station shared by multiple lines (e.g. Targeted mAb
// spans 5), April asked that its example drugs actually demonstrate every
// line it belongs to - not just whichever happened to get added first -
// and that each drug show which line/therapeutic area it represents. Each
// exampleDrugs entry now carries an "area" (only added for drugs used by
// a shared, multi-area station - single-area stations don't need it,
// since the area is already obvious from context). The tag is only shown
// when the station itself is shared (mod.areas.length > 1); showing it on
// every single-line station's drugs would just be visual noise repeating
// the breadcrumb. A few shared stations still have one line with no
// genuine drug example (e.g. no antibody-drug conjugate is approved for
// an autoimmune indication yet) - rather than force a fake or
// investigational-only example, that line is simply left uncovered here.
function drugListHtml(mod) {
  var isShared = mod.areas.length > 1;
  var drugs = mod.exampleDrugIds.map(function (id) {
    return state.data.exampleDrugs.filter(function (d) { return d.id === id; })[0];
  });
  return drugs.map(function (d) {
    var areaTag = "";
    if (isShared && d.area) {
      var areaObj = state.data.areas.filter(function (a) { return a.id === d.area; })[0];
      if (areaObj) {
        areaTag = "<span class=\"drug-area-tag\" style=\"background:" + esc(areaObj.color) + "\">" + esc(areaObj.name) + "</span>";
      }
    }
    return "<li><div class=\"drug-top\"><span class=\"drug-name\">" + esc(d.name) + "</span>" + areaTag + "</div>" +
      "<span class=\"drug-meta\">" + esc(d.company) + " &middot; " + d.year + "</span></li>";
  }).join("");
}

function compareCardHtml(mod) {
  var prosItems = mod.pros.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("");
  var consItems = mod.cons.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("");
  return (
    "<div class=\"compare-card\">" +
    "<h3>" + esc(mod.name) + "</h3>" +
    "<p>" + esc(mod.concept) + "</p>" +
    "<h4>Pros</h4><ul>" + prosItems + "</ul>" +
    "<h4>Cons</h4><ul>" + consItems + "</ul>" +
    "<p class=\"verdict\"><strong>Verdict:</strong> " + esc(mod.verdict) + "</p>" +
    "<h4>Example drugs</h4><ul class=\"drug-list\">" + drugListHtml(mod) + "</ul>" +
    "</div>"
  );
}

function showCompareView() {
  state.comparing = true;
  renderComparePanel();
}

function closeCompare() {
  state.comparing = false;
  // 2026-08-05: April asked that closing a comparison also unpin both
  // stations, so she can pin a fresh pair next time without manually
  // unpinning the old ones first each time.
  state.pinned = [];
  updateCompareButton();
  renderDetailPanel();
}

function renderComparePanel() {
  var panel = document.getElementById("detail-panel");
  var body = document.getElementById("detail-panel-body");
  var mods = state.pinned.map(function (id) {
    return state.data.modalities.filter(function (m) { return m.id === id; })[0];
  });
  panel.classList.remove("hidden");
  syncSheetBackdrop(true);
  body.innerHTML =
    "<div class=\"compare-header\">" +
    "<h3>Comparing modalities</h3>" +
    "<button class=\"back-inline\" data-action=\"close-compare\">&times; Close comparison</button>" +
    "</div>" +
    "<div class=\"compare-grid\">" + mods.map(compareCardHtml).join("") + "</div>";
  var closeBtn = body.querySelector('[data-action="close-compare"]');
  if (closeBtn) closeBtn.addEventListener("click", closeCompare);
}

function loadAtlas() {
  var statusEl = document.getElementById("status");
  var app = document.getElementById("app");

  fetch("data/content.json")
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (data) {
      state.data = data;
      statusEl.remove();
      buildMap(app);
      renderLegend();
      wireToolbar();
      setupMapAutoFit(app);
    })
    .catch(function (err) {
      statusEl.textContent = "Failed to load content.json: " + err.message;
      statusEl.style.color = "crimson";
    });
}

// 2026-08-06: April's "keep the whole map on the monitor screen" - CSS
// alone (width:100%/height:100% + preserveAspectRatio) turned out not to
// reliably contain-fit an inline root <svg> inside a flex box across
// browsers (the map was overflowing #app's actual width, forcing the
// horizontal scrollbar to kick in and cutting off the legend/right edge -
// exactly what April's last two screenshots showed). This computes the fit
// in JS instead, using #app's real measured pixel size (no ambiguity),
// and sets the SVG's width/height as explicit inline px - guaranteed to
// fit, recalculated live via ResizeObserver whenever #app's size changes
// for any reason (window resize, detail panel opening/closing, etc).
function fitMapToContainer(app) {
  var svg = document.getElementById("subway-map");
  if (!svg || !app) return;
  var vbParts = LAYOUT.viewBox.split(" ").map(Number);
  var vbW = vbParts[2], vbH = vbParts[3];
  var cw = app.clientWidth;
  var ch = app.clientHeight;
  if (!cw || !ch) return;

  // 2026-08-13: superseded by the radial wheel - the fill-edge-to-edge/
  // crop approach this comment used to describe was built for the tall,
  // narrow metro-line viewBox specifically (see buildWheelMap's own
  // comment for why that shape forced the fill-vs-see-everything
  // tradeoff in the first place). The wheel's viewBox is roughly square,
  // so plain contain-fit already uses nearly the full width with no
  // cropping needed - just reserve room at the top for the floating
  // header pill, same as every other floating-chrome element on this
  // page already does.
  if (isWheelMode()) {
    // 2026-08-20: was a flat 70px guess, which April found too short - the
    // floating header pill (safe-area inset + padding + h1 + two-line
    // subtitle) actually runs taller than that on her phone, so its bottom
    // edge overlapped the ON spoke. Measuring the real header element's
    // rendered bottom edge instead of guessing a pixel value makes this
    // correct regardless of device notch size or how many lines the
    // subtitle wraps to.
    var headerEl = document.querySelector("header");
    var topSafe = 70;
    if (headerEl) {
      var headerBottom = headerEl.getBoundingClientRect().bottom;
      var appTop = app.getBoundingClientRect().top;
      topSafe = Math.max(headerBottom - appTop, 0) + 24;
    }
    var usableH = Math.max(ch - topSafe, 100);
    var wScale = Math.min(cw / vbW, usableH / vbH);
    var wW = vbW * wScale, wH = vbH * wScale;
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.style.width = wW + "px";
    svg.style.height = wH + "px";
    svg.style.position = "absolute";
    svg.style.left = "50%";
    svg.style.top = topSafe + "px";
    svg.style.transform = "translateX(-50%)";
    svg.style.margin = "0";
    return;
  }

  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.style.position = "";
  svg.style.left = "";
  svg.style.top = "";
  svg.style.transform = "";
  svg.style.margin = "";
  var scale = Math.min(cw / vbW, ch / vbH);
  var w = Math.max(vbW * scale, 900);
  var h = w * (vbH / vbW);

  svg.style.width = w + "px";
  svg.style.height = h + "px";
}

function setupMapAutoFit(app) {
  fitMapToContainer(app);
  if (typeof ResizeObserver !== "undefined") {
    var ro = new ResizeObserver(function () {
      fitMapToContainer(app);
    });
    ro.observe(app);
  } else {
    // older-browser fallback - window resize alone misses the
    // detail-panel-open/close case, but ResizeObserver support is broad
    // enough (every current major browser) that this is a rare path.
    window.addEventListener("resize", function () {
      fitMapToContainer(app);
    });
  }
}

function svgEl(tag, attrs) {
  var el = document.createElementNS(SVG_NS, tag);
  Object.keys(attrs || {}).forEach(function (k) {
    el.setAttribute(k, attrs[k]);
  });
  return el;
}

// Splits a long station name into up to two lines so labels don't collide
// horizontally. Short names stay on one line.
function wrapLabel(name) {
  if (name.length <= 14) return [name];

  // 2026-08-02: Complement Inhibitor (PNH) sits right next to Hematology's
  // own vertical line - even fully clear of its own dot, the plain 2-line
  // wrap ("Complement Inhibitor" / "(PNH)") is wide enough at the enlarged
  // click-in size that it has to straddle the line, one side or the other.
  // Splitting the first line into two shorter rows narrows every row
  // enough to sit fully clear on one side, per April's explicit request.
  if (name === "Complement Inhibitor (PNH)") {
    return ["Complement", "Inhibitor", "(PNH)"];
  }

  // 2026-08-02 (round 7): Small Molecule (Kinase Inhibitor) sits in a
  // tight corridor between Cardiovascular's own line and the neighboring
  // Immune Checkpoint Inhibitor station's label - April asked to drop the
  // "Small Molecule" part from the map label entirely and keep only
  // "Kinase Inhibitor", as two short rows so it's narrow enough to clear
  // both neighbors (the full name still shows in the station's detail
  // panel via mod.name, unaffected - this only changes what's drawn on
  // the map).
  if (name === "Small Molecule (Kinase Inhibitor)") {
    return ["Kinase", "Inhibitor"];
  }

  var parenIdx = name.indexOf(" (");
  if (parenIdx !== -1) {
    return [name.slice(0, parenIdx), name.slice(parenIdx + 1)];
  }

  var mid = Math.floor(name.length / 2);
  var splitAt = -1;
  for (var d = 0; d < name.length; d++) {
    if (name.charAt(mid - d) === " ") { splitAt = mid - d; break; }
    if (name.charAt(mid + d) === " ") { splitAt = mid + d; break; }
  }
  if (splitAt === -1) return [name];
  return [name.slice(0, splitAt), name.slice(splitAt + 1)];
}

// Parses a "x,y x,y ..." points string into [{x,y}, ...].
function parsePoints(pointsStr) {
  return pointsStr.trim().split(/\s+/).map(function (p) {
    var xy = p.split(",");
    return { x: parseFloat(xy[0]), y: parseFloat(xy[1]) };
  });
}

// Builds a smooth-cornered SVG path "d" string from straight-segment
// points, like real transit maps - each interior corner is rounded with a
// quadratic curve instead of a sharp angle. Radius is clamped per-corner
// so it never exceeds half of either adjoining segment's length.
//
// A rounded corner always "cuts the corner" short of the true vertex - for
// a normal turn by about radius*0.4, for a full U-turn spike by about
// radius/2. When that vertex is a station's exact position, the cut can
// leave a visible gap between the line and the station dot. So corners
// that land exactly on a station (per stationPoints) use a much smaller
// radius - just enough to stay smooth while guaranteeing the curve still
// reaches into the dot - while pure routing bends keep the full radius.
function roundedPathD(points, radius, stationPoints) {
  if (points.length < 2) return "";
  var STATION_CORNER_RADIUS = 6;
  var d = "M " + points[0].x + " " + points[0].y + " ";
  for (var i = 1; i < points.length - 1; i++) {
    var prev = points[i - 1];
    var curr = points[i];
    var next = points[i + 1];

    var d1x = curr.x - prev.x, d1y = curr.y - prev.y;
    var len1 = Math.sqrt(d1x * d1x + d1y * d1y);
    var d2x = next.x - curr.x, d2y = next.y - curr.y;
    var len2 = Math.sqrt(d2x * d2x + d2y * d2y);

    var isStation = stationPoints && stationPoints[curr.x + "," + curr.y];
    var effRadius = isStation ? Math.min(radius, STATION_CORNER_RADIUS) : radius;
    var r = Math.min(effRadius, len1 / 2, len2 / 2);

    var p1x = curr.x - (d1x / len1) * r;
    var p1y = curr.y - (d1y / len1) * r;
    var p2x = curr.x + (d2x / len2) * r;
    var p2y = curr.y + (d2y / len2) * r;

    d += "L " + p1x + " " + p1y + " ";
    d += "Q " + curr.x + " " + curr.y + " " + p2x + " " + p2y + " ";
  }
  var last = points[points.length - 1];
  d += "L " + last.x + " " + last.y + " ";
  return d;
}

// Every station's {x,y} as a "x,y" lookup set, used by roundedPathD to
// know which path vertices are real stations vs. pure routing bends.
//
// 2026-08-10: interchange pills can now stack their dots HORIZONTALLY at
// arbitrary per-line x-offsets (see LAYOUT.pillGeometry / buildMap) rather
// than always sitting at the pill's own center x. A line's real path
// touches its OWN dot's exact (offset) position, not the station center -
// without also registering those offset points here, roundedPathD would
// treat that touch as an ordinary routing bend and apply the full corner
// radius there, reopening the exact "rounded corner falls short of the
// dot" gap bug fixed earlier (see the SGLT2 orange-line history above).
function buildStationPointSet() {
  var set = {};
  Object.keys(LAYOUT.stationPos).forEach(function (id) {
    var p = LAYOUT.stationPos[id];
    set[p.x + "," + p.y] = true;
  });
  if (LAYOUT.pillGeometry) {
    Object.keys(LAYOUT.pillGeometry).forEach(function (id) {
      var pos = LAYOUT.stationPos[id];
      var geo = LAYOUT.pillGeometry[id];
      if (!pos || !geo) return;
      Object.keys(geo.dotX).forEach(function (area) {
        var dx = pos.x + geo.dotX[area];
        set[dx + "," + pos.y] = true;
      });
    });
  }
  return set;
}

var CORNER_RADIUS = 20;

// Base vertical gap (SVG units) between wrapped label lines at the
// station-label's resting 16px font-size. See updateLabelLineSpacing()
// below for how this scales up when a label's font-size grows.
var LABEL_LINE_GAP = 15;

// 2026-08-05: city background (April's "make it like a real city map,
// add skyscrapers/river/bridges" request, refined over several rounds -
// lighter dusk palette, full-bleed river crossing instead of edge-only,
// 3D isometric buildings instead of flat rectangles, and slow ambient
// motion: window twinkle, bridge-light breathing, a flowing light
// pattern along the river current). Deterministic (seeded RNG) so the
// layout is stable across reloads rather than reshuffling every visit.
// Everything renders BEHIND the lines/stations at low opacity so it
// reads as atmosphere, not competing content.
function seededRandom(seed) {
  var s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildCityBuilding(rnd, x, y, w, h, roofStyle) {
  // 2026-08-07: windows now live in their own un-dimmed group (see the
  // "windows" g below, returned alongside this one and appended as a
  // sibling in buildCityBackground) rather than as children of `g`. `g`
  // carries opacity:0.4 for the building silhouette itself - nesting the
  // windows inside it capped their own twinkle (up to 0.95) at an
  // effective ~0.38, which read as barely-there. Splitting them out lets
  // the lit windows read at full brightness against the still-muted
  // building fronts, per April's "make the building lights more obvious".
  var g = svgEl("g", { class: "city-building", opacity: 0.4 });
  var windows = svgEl("g", { class: "city-windows" });
  var sideW = w * 0.28;
  var skew = sideW * 0.55;

  // front face (lit) + a narrower side face (darker, unlit) skewed off
  // the right edge - the cheap "isometric box" trick that makes a plain
  // rectangle read as a building corner instead of a flat cutout
  // 2026-08-05: dawn palette - muted mauve/pink instead of dusk blue, per
  // April's "dawn effect" pick over the earlier blue-dusk mood.
  g.appendChild(svgEl("rect", { x: x, y: y, width: w - sideW, height: h, fill: "#c9a3ab" }));
  var fx = x + (w - sideW);
  var sidePts = [
    [fx, y], [fx + sideW, y - skew * 0.15],
    [fx + sideW, y + h - skew * 0.15], [fx, y + h]
  ].map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ");
  g.appendChild(svgEl("polygon", { points: sidePts, fill: "#8f6b73" }));

  // roofline variety (flat/antenna/setback/pointed) - real skylines are
  // never uniform rectangles, and this alone does a lot to sell "city"
  var roofW = w - sideW;
  if (roofStyle === "antenna") {
    var ax = x + roofW * 0.5;
    g.appendChild(svgEl("line", { x1: ax, y1: y - 18, x2: ax, y2: y, stroke: "#8f6b73", "stroke-width": 1.6 }));
    g.appendChild(svgEl("circle", { cx: ax, cy: y - 18, r: 2, fill: "#ff8a80", opacity: 0.85 }));
  } else if (roofStyle === "setback") {
    var sw = roofW * 0.55, sh = h * 0.18;
    var sx = x + (roofW - sw) / 2;
    g.appendChild(svgEl("rect", { x: sx, y: y - sh, width: sw * 0.72, height: sh, fill: "#c9a3ab" }));
    var setbackPts = [
      [sx + sw * 0.72, y - sh], [sx + sw, y - sh - skew * 0.1],
      [sx + sw, y - skew * 0.1], [sx + sw * 0.72, y]
    ].map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ");
    g.appendChild(svgEl("polygon", { points: setbackPts, fill: "#8f6b73" }));
  } else if (roofStyle === "pointed") {
    var apex = x + roofW * 0.5;
    var peakPts = [[x, y], [apex, y - 22], [x + roofW, y]]
      .map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ");
    g.appendChild(svgEl("polygon", { points: peakPts, fill: "#c9a3ab" }));
  }

  // windows on the front face only, each with its own randomized
  // (negative) animation-delay so the twinkle keyframe (style.css)
  // doesn't sync every window to the same beat. Sized up from the
  // original 1.8x2.6 and, for warm (lit) windows, given a soft halo
  // rect behind them - same layered-glow trick as the bridge lights
  // (city-bridge-light-core/-halo) - so they read as actually glowing
  // rather than just being a bigger flat square.
  var frontW = w * 0.72;
  var rows = Math.max(2, Math.floor(h / 9));
  var cols = Math.max(1, Math.floor(frontW / 7));
  for (var r = 1; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      if (rnd() > 0.42) continue;
      var wx = x + 2 + c * (frontW / cols);
      var wy = y + r * (h / rows);
      var warm = rnd() > 0.35;
      var delay = (-rnd() * 5).toFixed(2) + "s";
      if (warm) {
        windows.appendChild(svgEl("rect", {
          x: wx - 1.1, y: wy - 1.1, width: 4.6, height: 5.4, rx: 1,
          fill: "#ffcf7a", class: "city-window-halo",
          style: "animation-delay:" + delay
        }));
      }
      windows.appendChild(svgEl("rect", {
        x: wx, y: wy, width: 2.4, height: 3.4,
        fill: warm ? "#ffe3ad" : "#ffffff", class: "city-window",
        style: "animation-delay:" + delay
      }));
    }
  }
  return [g, windows];
}

function buildCityBackground(svg, vbParts) {
  var VB = { x0: parseFloat(vbParts[0]), y0: parseFloat(vbParts[1]), w: parseFloat(vbParts[2]), h: parseFloat(vbParts[3]) };
  var x1 = VB.x0 + VB.w, y1 = VB.y0 + VB.h;
  var rnd = seededRandom(23);
  // 2026-08-08: portrait (mobile) canvas is a very different aspect ratio
  // from the original landscape desktop canvas - several elements below
  // that used to be tuned as fixed absolute pixel positions (safe only on
  // desktop's specific ~2230x1225 canvas) now branch on this flag so they
  // get their own portrait-appropriate placement instead of drifting
  // off-canvas or bunching up. Anything already expressed as a VB.w/VB.h
  // fraction needed no change and applies to both automatically.
  var isPortrait = VB.h > VB.w;

  var defs = svgEl("defs", {});

  // 2026-08-05: dawn palette (April picked "dawn" over the earlier blue-
  // dusk mood after previewing both dawn and a more saturated sunrise
  // variant) - a soft blue-to-pink-to-peach-to-cream sky wash, a low sun
  // near the horizon, and a pink/orange river instead of blue. Kept light
  // enough overall that the original dark label/text colors stay legible
  // with no separate text-color overrides needed, unlike a true night mode.
  var skyGrad = svgEl("linearGradient", { id: "city-sky-grad", x1: 0, y1: 0, x2: 0.3, y2: 1 });
  skyGrad.appendChild(svgEl("stop", { offset: "0%", "stop-color": "#aecbe0" }));
  skyGrad.appendChild(svgEl("stop", { offset: "38%", "stop-color": "#eecfd0" }));
  skyGrad.appendChild(svgEl("stop", { offset: "68%", "stop-color": "#f8dcb8" }));
  skyGrad.appendChild(svgEl("stop", { offset: "100%", "stop-color": "#fdf0dc" }));
  defs.appendChild(skyGrad);

  var riverGrad = svgEl("linearGradient", { id: "city-river-grad", x1: 0, y1: 0, x2: 0, y2: 1 });
  riverGrad.appendChild(svgEl("stop", { offset: "0%", "stop-color": "#e8a9a0" }));
  riverGrad.appendChild(svgEl("stop", { offset: "100%", "stop-color": "#f8cf9a" }));
  defs.appendChild(riverGrad);

  var sunGrad = svgEl("radialGradient", { id: "city-sun-grad", cx: "50%", cy: "50%", r: "50%" });
  sunGrad.appendChild(svgEl("stop", { offset: "0%", "stop-color": "#fff8e8" }));
  sunGrad.appendChild(svgEl("stop", { offset: "50%", "stop-color": "#ffd9a0" }));
  sunGrad.appendChild(svgEl("stop", { offset: "100%", "stop-color": "#ffb877", "stop-opacity": 0 }));
  defs.appendChild(sunGrad);

  svg.appendChild(defs);

  var g = svgEl("g", { class: "city-bg" });

  // low sun near the horizon with a soft glow halo - no rays (that's the
  // more dramatic "sunrise" variant April previewed but didn't pick), just
  // a gentle disc + glow, which is what keeps this reading as "dawn" and
  // not "night" or "sunrise"
  g.appendChild(svgEl("circle", { cx: VB.x0 + VB.w * 0.78, cy: y1 - 40, r: 170, fill: "url(#city-sun-grad)" }));
  g.appendChild(svgEl("circle", { cx: VB.x0 + VB.w * 0.78, cy: y1 - 40, r: 40, fill: "#fff3d6", opacity: 0.9 }));

  // 2026-08-06: two ground-level streets (April's "add a little bit more
  // trees, or road" request) - gives the skyline a ground plane instead of
  // just floating buildings. Kept away from the sun corner and the legend
  // box: roadY sits above the legend's own y-range, roadX sits well left
  // of it.
  function addCityRoad(rx1, ry1, rx2, ry2) {
    g.appendChild(svgEl("line", { x1: rx1, y1: ry1, x2: rx2, y2: ry2, stroke: "#d9c8b8", "stroke-width": 14, opacity: 0.35, "stroke-linecap": "round" }));
    g.appendChild(svgEl("line", { x1: rx1, y1: ry1, x2: rx2, y2: ry2, stroke: "#fff3d6", "stroke-width": 2, opacity: 0.5, "stroke-dasharray": "10 14", "stroke-linecap": "round" }));
  }
  var roadY = VB.y0 + VB.h * 0.55;
  var roadX = VB.x0 + VB.w * 0.22;
  addCityRoad(VB.x0 - 40, roadY, x1 + 40, roadY);
  addCityRoad(roadX, VB.y0 - 40, roadX, y1 + 40);
  // 2026-08-06 (round 5): third road, at the vertical line April marked
  // crossing the whole map, just left of the legend box so it doesn't run
  // under it. 2026-08-08: made relative to MAP_LEGEND_BOX's own (now
  // viewBox-responsive) position instead of the hardcoded x:1250 - on
  // desktop this still resolves to exactly 1250 (no regression); on the
  // narrower mobile canvas it correctly sits just left of the smaller,
  // repositioned legend box instead of running off-canvas.
  var thirdRoadX = MAP_LEGEND_BOX.x - 30;
  addCityRoad(thirdRoadX, VB.y0 - 40, thirdRoadX, y1 + 40);

  // buildings scattered full-bleed across the whole canvas (not just the
  // edges) at low density/opacity, so the skyline sits behind every line
  // rather than just framing the map. 2026-08-08: row count now derives
  // from the canvas aspect ratio (cols stays 16) so building cells stay
  // roughly the same shape on any viewBox - on desktop's ~2230x1225 this
  // still resolves to the original 9 rows exactly; on mobile's taller
  // 1260x1660 portrait canvas it correctly scales up to ~21 rows instead
  // of stretching 9 rows' worth of buildings into much taller cells.
  var cols = 16, rows = Math.round(cols * (VB.h / VB.w)), density = 0.24;
  var cw = VB.w / cols, ch = VB.h / rows;
  var roofs = ["flat", "flat", "antenna", "setback", "pointed", "flat"];
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      if (rnd() > density) continue;
      var bw = cw * (0.4 + rnd() * 0.4);
      var bh = ch * (0.4 + rnd() * 0.45);
      var bx = VB.x0 + c * cw + (cw - bw) * rnd();
      var by = VB.y0 + r * ch + (ch - bh) * rnd();
      var roof = roofs[Math.floor(rnd() * roofs.length)];
      var built = buildCityBuilding(rnd, bx, by, bw, bh, roof);
      g.appendChild(built[0]);
      g.appendChild(built[1]);
    }
  }

  // trees - a muted sage/olive palette that sits quietly behind the mauve
  // skyline: some lining the two streets (like real street trees), a few
  // more scattered freely in the open gaps between buildings
  function buildCityTree(tx, ty, size) {
    var tg = svgEl("g", { class: "city-tree", opacity: 0.4 });
    tg.appendChild(svgEl("line", { x1: tx, y1: ty + size * 0.5, x2: tx, y2: ty + size, stroke: "#8a6b52", "stroke-width": size * 0.12 }));
    tg.appendChild(svgEl("circle", { cx: tx - size * 0.22, cy: ty + size * 0.35, r: size * 0.34, fill: "#93a878" }));
    tg.appendChild(svgEl("circle", { cx: tx + size * 0.22, cy: ty + size * 0.3, r: size * 0.36, fill: "#a3b789" }));
    tg.appendChild(svgEl("circle", { cx: tx, cy: ty + size * 0.12, r: size * 0.4, fill: "#b0c496" }));
    return tg;
  }
  function scatterTreesAlong(rx1, ry1, rx2, ry2, count, offsetDist) {
    var perpX = ry2 - ry1, perpY = -(rx2 - rx1);
    var plen = Math.sqrt(perpX * perpX + perpY * perpY) || 1;
    for (var ti = 0; ti < count; ti++) {
      var tt = rnd();
      var tx = rx1 + (rx2 - rx1) * tt;
      var ty = ry1 + (ry2 - ry1) * tt;
      var side = rnd() > 0.5 ? 1 : -1;
      var ox = tx + (perpX / plen) * offsetDist * side;
      var oy = ty + (perpY / plen) * offsetDist * side;
      g.appendChild(buildCityTree(ox, oy, 16 + rnd() * 10));
    }
  }
  scatterTreesAlong(VB.x0 - 40, roadY, x1 + 40, roadY, 10, 16);
  scatterTreesAlong(roadX, VB.y0 - 40, roadX, y1 + 40, 8, 16);
  for (var tfree = 0; tfree < 10; tfree++) {
    g.appendChild(buildCityTree(VB.x0 + rnd() * VB.w, VB.y0 + rnd() * VB.h, 14 + rnd() * 10));
  }

  // 2026-08-06: a dedicated park - April asked for "a park with a lot of
  // trees or plants" but that it not interfere with the actual metro
  // diagram. Placed in the one large rectangle that's genuinely empty of
  // every line, station, label and the legend box: the top-right corner
  // (x:1600-1950, y:100-460) - clear of Infectious Disease's rightmost run
  // (stops at x:1450), clear of the legend (which starts at y:770), and
  // clear of the nearby bridge at (1604,40) since the park starts at y:100.
  // A soft green ground patch sits under a dense mix of trees and smaller
  // shrub clusters (no trunk, just layered canopy) for variety.
  function buildCityShrub(sx, sy, size) {
    var sg = svgEl("g", { class: "city-tree", opacity: 0.4 });
    sg.appendChild(svgEl("circle", { cx: sx - size * 0.3, cy: sy, r: size * 0.4, fill: "#a3b789" }));
    sg.appendChild(svgEl("circle", { cx: sx + size * 0.3, cy: sy + size * 0.05, r: size * 0.42, fill: "#93a878" }));
    sg.appendChild(svgEl("circle", { cx: sx, cy: sy - size * 0.15, r: size * 0.38, fill: "#b0c496" }));
    return sg;
  }
  function addCityPark(cx, cy, rx, ry, count) {
    g.appendChild(svgEl("ellipse", { cx: cx, cy: cy, rx: rx, ry: ry, fill: "#c3d4a8", opacity: 0.18 }));
    for (var pi = 0; pi < count; pi++) {
      var ang = rnd() * Math.PI * 2;
      var rad = Math.sqrt(rnd());
      var px = cx + Math.cos(ang) * rx * rad;
      var py = cy + Math.sin(ang) * ry * rad;
      if (rnd() > 0.35) {
        g.appendChild(buildCityTree(px, py, 14 + rnd() * 14));
      } else {
        g.appendChild(buildCityShrub(px, py, 10 + rnd() * 8));
      }
    }
  }
  // 2026-08-08: desktop's park spot (1775,280) was hand-picked for that
  // canvas's specific open corner (clear of ID's rightmost run, the legend,
  // and the nearby bridge) and sits entirely off-canvas on the much
  // narrower mobile viewBox. Mobile gets its own spot, found the same way
  // desktop's was (a script-based clearance sweep against every real line
  // segment, station and the legend box) - (110,910), on the left edge
  // roughly a third of the way down, came back with 250+ units of
  // clearance in every direction, the most open pocket on the portrait
  // canvas. Sized down to fit (rx/ry ~half desktop's) and fewer trees to
  // match.
  if (isPortrait) {
    addCityPark(110, 910, 95, 100, 18);
  } else {
    addCityPark(1775, 280, 175, 180, 30);
  }

  // 2026-08-06: traffic lights, per April's ask. Checked every real line
  // segment, station, badge and the legend box against candidate points
  // first (a script-based clearance sweep, not eyeballed) - the two
  // decorative streets run within a few units of several real lines for
  // most of their length (they're meant to read as "the roads the metro
  // runs under", so that's fine at low opacity), but the horizontal
  // street's far-east stretch (x:1600-1990, near the park, well below the
  // legend) came back with 150-270 units of clearance from anything real -
  // by far the safest spot, so the lights go there, right on that road.
  // 2026-08-06 (round 2): April asked for these bigger, and for the lights
  // to actually switch between colors rather than sit static. Scaled the
  // whole fixture up ~1.7x, and gave each of the 3 dots its own class +
  // a staggered animation-delay (base, base+2s, base+4s) on the same 6s
  // opacity-pulse keyframe (see .city-traffic-red/-yellow/-green in
  // style.css) - each dot brightens in turn for a 2s window, so the two
  // fixtures visibly cycle red -> yellow -> green -> repeat, each on its
  // own independent random phase (like the window twinkle) so the two
  // lights aren't in lockstep with each other.
  function buildTrafficLight(tx, ty) {
    var lg = svgEl("g", { class: "city-traffic-light", opacity: 0.6 });
    var base = rnd() * 6;
    lg.appendChild(svgEl("line", { x1: tx, y1: ty, x2: tx, y2: ty - 64, stroke: "#5a5a5a", "stroke-width": 3 }));
    lg.appendChild(svgEl("rect", { x: tx - 7, y: ty - 90, width: 14, height: 29, rx: 3, fill: "#3a3a3a" }));
    lg.appendChild(svgEl("circle", { cx: tx, cy: ty - 84, r: 2.9, fill: "#ff6b5e", class: "city-traffic-red", style: "animation-delay:-" + base.toFixed(2) + "s" }));
    lg.appendChild(svgEl("circle", { cx: tx, cy: ty - 75, r: 2.9, fill: "#ffd166", class: "city-traffic-yellow", style: "animation-delay:-" + (base + 2).toFixed(2) + "s" }));
    lg.appendChild(svgEl("circle", { cx: tx, cy: ty - 66, r: 2.9, fill: "#8fd694", class: "city-traffic-green", style: "animation-delay:-" + (base + 4).toFixed(2) + "s" }));
    return lg;
  }
  // 2026-08-06 (round 5): April marked the exact spot on a screenshot -
  // just right of and below the SGLT2 dot, roughly (-22,505) once mapped
  // from the image back into SVG coordinates. Swept the whole fixture's
  // footprint (base through the top of the housing) around that marked
  // point: at the exact mark, the housing top comes within 1 unit of the
  // Metabolic line (basically touching it). (40, 560) - about 60 units
  // right/below her mark, same open pocket - is the closest point where
  // the entire fixture clears every real line by 56+ units.
  // 2026-08-08: desktop's two spots ((1700,roadY) and (40,560)) were swept
  // against desktop's specific line geometry, and (1700,...) is off-canvas
  // on the 1260-wide mobile viewBox entirely. Mobile gets its own
  // clearance-swept pair: (1200,220) and (1200,1100), both on the open
  // right-hand margin of the portrait canvas, 280 units clear of every
  // real line/station/label/legend-box in every direction, spread top-
  // third and bottom-third so they don't read as a matched set.
  if (isPortrait) {
    g.appendChild(buildTrafficLight(1200, 220));
    g.appendChild(buildTrafficLight(1200, 1100));
  } else {
    g.appendChild(buildTrafficLight(1700, roadY));
    g.appendChild(buildTrafficLight(40, 560));
  }

  // river sweeps diagonally through the whole canvas, under the lines -
  // routed through the layout's more open corners rather than through
  // the densest label clusters
  // 2026-08-08: the 5 waypoints used to be fixed pixel offsets from the
  // bottom edge (y1-120, y1-260, ... y1-980), tuned so the river covers
  // about 80% of desktop's own ~1225-tall canvas. On mobile's much taller
  // 1660-tall portrait canvas those same absolute offsets only reached
  // ~59% of the way up, leaving the whole top third of the map with no
  // river at all. Offsets are now VB.h fractions instead (120/260/520/
  // 760/980 divided by desktop's original 1225 height) - on desktop this
  // resolves to the exact same pixel values as before (no regression); on
  // mobile it now spans the same ~80% of the full portrait height.
  var riverPts = [
    [VB.x0 - 40, y1 - VB.h * (120 / 1225)],
    [VB.x0 + VB.w * 0.28, y1 - VB.h * (260 / 1225)],
    [VB.x0 + VB.w * 0.55, y1 - VB.h * (520 / 1225)],
    [VB.x0 + VB.w * 0.8, y1 - VB.h * (760 / 1225)],
    [x1 + 40, y1 - VB.h * (980 / 1225)]
  ];
  function riverPathD(amp, pts) {
    var d = "M " + pts[0][0] + "," + pts[0][1];
    for (var i = 1; i < pts.length; i++) {
      var px = pts[i - 1][0], py = pts[i - 1][1];
      var cx = pts[i][0], cy = pts[i][1];
      var mx = (px + cx) / 2 + (i % 2 === 0 ? amp : -amp);
      d += " Q " + mx + "," + ((py + cy) / 2) + " " + cx + "," + cy;
    }
    return d;
  }
  var riverD = riverPathD(75, riverPts);
  g.appendChild(svgEl("path", {
    d: riverD, stroke: "url(#city-river-grad)", "stroke-width": 82,
    fill: "none", opacity: 0.5, "stroke-linecap": "round"
  }));

  // flowing current: a dashed highlight traced along the same river
  // path, animated via stroke-dashoffset (see .city-river-flow keyframe
  // in style.css) - the twinkling light streaks below fade in place,
  // this is what actually reads as "water moving downstream". Dash size
  // and opacity bumped up (was a sparse 4px blip on a 42px gap) per
  // April's "too slow and subtle" feedback - bigger, brighter segments
  // read as an actual current instead of an occasional flicker.
  g.appendChild(svgEl("path", {
    d: riverD, stroke: "#fff3d6", "stroke-width": 12, fill: "none", opacity: 0.55,
    "stroke-linecap": "round", "stroke-dasharray": "18 28",
    class: "city-river-flow", transform: "translate(0,-18)"
  }));

  // ambient light streaks scattered along the river, independently
  // twinkling (glints of light on moving water)
  for (var i = 0; i < 40; i++) {
    var t = rnd();
    var sx = VB.x0 - 40 + t * (VB.w + 80);
    var sy = y1 - 120 - t * (y1 - 120 - (VB.y0 - 40));
    var len = 8 + rnd() * 22;
    var warmS = rnd() > 0.45;
    var delayS = (-rnd() * 4.5).toFixed(2) + "s";
    g.appendChild(svgEl("line", {
      x1: sx, y1: sy, x2: sx, y2: sy + len,
      stroke: warmS ? "#ffe3ad" : "#ffffff", "stroke-width": 1.4,
      class: "city-light-streak", style: "animation-delay:" + delayS
    }));
  }

  // bridges at 3 fixed points computed to sit ON the river's path (an
  // earlier hand-guessed placement drifted off the visible river band,
  // which made their deck lights hard to spot - see 2026-08-05 fix)
  function addBridge(cx, cy, angleDeg, span) {
    var rad = (angleDeg * Math.PI) / 180;
    var dx = Math.cos(rad), dy = Math.sin(rad);
    var half = span / 2;
    var bx1 = cx - dx * half, by1 = cy - dy * half;
    var bx2 = cx + dx * half, by2 = cy + dy * half;
    var nx = -dy, ny = dx;
    g.appendChild(svgEl("line", { x1: bx1, y1: by1, x2: bx2, y2: by2, stroke: "#5c7a95", "stroke-width": 9, opacity: 0.9 }));
    g.appendChild(svgEl("line", { x1: cx - nx * 10, y1: cy - ny * 10 - 30, x2: cx - nx * 10, y2: cy - ny * 10 + 30, stroke: "#3f5a75", "stroke-width": 5, opacity: 0.9 }));
    g.appendChild(svgEl("line", { x1: cx + nx * 10, y1: cy + ny * 10 - 30, x2: cx + nx * 10, y2: cy + ny * 10 + 30, stroke: "#3f5a75", "stroke-width": 5, opacity: 0.9 }));
    // 2026-08-06: April found this too dense up close (~9 light pairs per
    // bridge, even though 3 bridges together read fine at full-map scale) -
    // spaced them out (13 -> 36) for ~4 per bridge, more like real bridge
    // lamp posts than a solid string of bulbs.
    for (var t2 = -half + 6; t2 <= half - 6; t2 += 36) {
      var lx = cx + dx * t2, ly = cy + dy * t2;
      var delayB = (-rnd() * 3.5).toFixed(2) + "s";
      g.appendChild(svgEl("circle", { cx: lx, cy: ly, r: 7, fill: "#ffb84d", class: "city-bridge-light-halo", style: "animation-delay:" + delayB }));
      g.appendChild(svgEl("circle", { cx: lx, cy: ly, r: 3.2, fill: "#ffcf7a", class: "city-bridge-light-core", style: "animation-delay:" + delayB }));
    }
  }
  // 2026-08-06: April asked for the middle bridge to look different from
  // the other two - the two outer bridges stay the simple beam-with-piers
  // style above; this one is a suspension bridge instead: two tall towers
  // set in from the ends, a sagging main cable running anchor -> tower ->
  // mid-span dip -> tower -> anchor, and thin vertical hangers dropping
  // from the cable to the deck between the towers. Same deck-light spacing
  // as the other two (36 units) so the density stays consistent.
  function addSuspensionBridge(cx, cy, angleDeg, span) {
    var rad = (angleDeg * Math.PI) / 180;
    var dx = Math.cos(rad), dy = Math.sin(rad);
    var half = span / 2;
    var bx1 = cx - dx * half, by1 = cy - dy * half;
    var bx2 = cx + dx * half, by2 = cy + dy * half;
    var nx = -dy, ny = dx;

    g.appendChild(svgEl("line", { x1: bx1, y1: by1, x2: bx2, y2: by2, stroke: "#5c7a95", "stroke-width": 9, opacity: 0.9 }));

    var towerT = half * 0.55;
    var towerTops = [-towerT, towerT].map(function (t) {
      // 2026-08-06: lengthened the below-deck leg (12 -> 35) so each tower
      // visibly "stands" under the bridge instead of just barely poking
      // past the deck line - checked the new pier-bottom points against
      // every real line first (19.6/37.6 units clear of Rare Disease, the
      // nearest thing either way).
      var tx = cx + dx * t - nx * 10, ty = cy + dy * t - ny * 10;
      g.appendChild(svgEl("line", { x1: tx, y1: ty - 55, x2: tx, y2: ty + 35, stroke: "#3f5a75", "stroke-width": 5, opacity: 0.9 }));
      g.appendChild(svgEl("circle", { cx: tx, cy: ty - 55, r: 3, fill: "#ffcf7a", opacity: 0.8 }));
      return { x: tx, y: ty - 55 };
    });
    var anchor1 = { x: bx1, y: by1 }, anchor2 = { x: bx2, y: by2 };
    var midDip = { x: cx - nx * 10, y: cy - ny * 10 + 18 };
    var cablePath =
      "M " + anchor1.x + "," + anchor1.y +
      " Q " + (anchor1.x * 0.35 + towerTops[0].x * 0.65) + "," + (anchor1.y * 0.35 + towerTops[0].y * 0.65) + " " + towerTops[0].x + "," + towerTops[0].y +
      " Q " + ((towerTops[0].x + midDip.x) / 2) + "," + ((towerTops[0].y + midDip.y) / 2 + 12) + " " + midDip.x + "," + midDip.y +
      " Q " + ((midDip.x + towerTops[1].x) / 2) + "," + ((midDip.y + towerTops[1].y) / 2 + 12) + " " + towerTops[1].x + "," + towerTops[1].y +
      " Q " + (anchor2.x * 0.35 + towerTops[1].x * 0.65) + "," + (anchor2.y * 0.35 + towerTops[1].y * 0.65) + " " + anchor2.x + "," + anchor2.y;
    g.appendChild(svgEl("path", { d: cablePath, stroke: "#a88b7a", "stroke-width": 2, fill: "none", opacity: 0.85 }));

    for (var ht = -towerT + 15; ht <= towerT - 15; ht += 15) {
      var hx = cx + dx * ht, hy = cy + dy * ht;
      var frac = Math.abs(ht) / towerT;
      var cableY = hy - (55 * (1 - frac) + 18 * frac) * 0.6;
      g.appendChild(svgEl("line", { x1: hx, y1: cableY, x2: hx, y2: hy, stroke: "#a88b7a", "stroke-width": 1, opacity: 0.6 }));
    }

    for (var t2 = -half + 6; t2 <= half - 6; t2 += 36) {
      var lx = cx + dx * t2, ly = cy + dy * t2;
      var delayB = (-rnd() * 3.5).toFixed(2) + "s";
      g.appendChild(svgEl("circle", { cx: lx, cy: ly, r: 7, fill: "#ffb84d", class: "city-bridge-light-halo", style: "animation-delay:" + delayB }));
      g.appendChild(svgEl("circle", { cx: lx, cy: ly, r: 3.2, fill: "#ffcf7a", class: "city-bridge-light-core", style: "animation-delay:" + delayB }));
    }
  }

  // 2026-08-08: desktop's 3 fixed points were tuned to sit on desktop's own
  // river path and are meaningless on mobile's differently-shaped river.
  // Mobile instead uses 3 of the river's own waypoints directly (they're
  // guaranteed to sit exactly ON the curve, since each Q segment ends
  // precisely at its target point) - the 2nd, 3rd and 4th of the 5 river
  // points, skipping the 1st/5th since those sit just off-canvas by design
  // (VB.x0-40 / x1+40, for a full-bleed edge-to-edge look).
  if (isPortrait) {
    addBridge(riverPts[1][0], riverPts[1][1], 60, 120);
    addSuspensionBridge(riverPts[2][0], riverPts[2][1], 60, 120);
    addBridge(riverPts[3][0], riverPts[3][1], 60, 120);
  } else {
    addBridge(30, 804, 60, 120);
    addSuspensionBridge(865, 405, 60, 120);
    addBridge(1604, 40, 60, 120);
  }

  svg.appendChild(g);
}

// ---- Radial wheel -> rotatable beta-barrel (mobile) ----
// 2026-08-13: replaces the metro-line rendering for mobile widths, per
// April's call to move away from a tall vertical strip that couldn't fit
// a phone screen without either cropping or big side margins. Areas become
// strands computed from state.data at build time - a new area or modality
// in content.json places itself automatically, no coordinate work needed.
//
// 2026-08-21: the flat radial-spoke wheel (v1) was replaced with a 3D-style
// rotatable beta-barrel per April's explicit redesign request - each area
// is now a ribbon-like strand arranged around a cylinder, with organic
// per-strand jitter (twist/bulge/loop-length) and depth-based shading/
// occlusion, approved after ~24 mockup iterations (see /tmp/barrel3d in
// that session) and calibrated to real GFP proportions (42x24 A, RCSB/
// PDB-101 - height:diameter ~= 1.75:1). See buildWheelMap/renderBarrelFrame
// below for the geometry; isWheelMode() below still gates mobile-only
// behavior exactly as it did for the flat wheel, so the name is kept even
// though the visual is no longer a flat wheel.
//
// Deliberately still reuses the exact classes/data-attributes the metro
// code already wires up - .area-badge[data-area], .station-dot
// [data-station], clicks calling the same selectArea()/selectStation() -
// so every existing interaction (applyFocusState's fade-on-select, the
// detail bottom sheet, pin-to-compare) keeps working unchanged. The one
// addition: applyFocusState() now also calls scheduleBarrelRedraw() in
// wheel mode, since the barrel's strand colors are computed per-depth in
// JS on every frame and can't be expressed as static CSS the way the flat
// wheel's line-path stroke colors were. Free-form panning
// (setupMapPanning) is still skipped - the barrel is rotated via its own
// drag handling (setupBarrelDrag) instead. Tapping an area badge/strand/
// station now rotates that strand to face the viewer (rotateBarrelToFront)
// instead of the flat wheel's viewBox zoom-to-spoke.
//
// v1 per April's explicit "we'll revise from here": shared/interchange
// modalities (e.g. ADC, spanning Immunology + Oncology) are drawn once on
// their primary area's strand with no visual distinction yet beyond the
// existing .interchange-dot style - flagged already as the next round of
// polish, not attempted here.
function isWheelMode() {
  return LAYOUT === MOBILE_LAYOUT;
}

function wheelPerArea() {
  var per = {};
  state.data.areas.forEach(function (a) { per[a.id] = []; });
  state.data.modalities.forEach(function (m) {
    m.areas.forEach(function (aid) {
      if (per[aid]) per[aid].push(m);
    });
  });
  return per;
}

function wheelPolar(cx, cy, angleDeg, r) {
  var rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// ---- Beta-barrel geometry (v24 mockup, approved 2026-08-21) ----
// Ported from the /tmp/barrel3d Python prototype April iterated on. A
// strand's screen x/depth comes from projecting a point rotating around a
// cylinder (x = cx + r*sin(ang), depth = cos(ang): 1 = facing the viewer,
// -1 = facing away); apparent ribbon width scales with abs(depth) (a
// strand reads full-width face-on, edge-on when depth=0) - see
// barrelStrandPoint/renderBarrelFrame below.
var BARREL_W = 900, BARREL_H = 980;
var BARREL_TOP_Y = 210, BARREL_BOT_Y = 790;
var BARREL_RADIUS = 150;        // GFP-accurate: 42x24 A -> ~1.75:1 height:diameter
var BARREL_BULGE = 0.10;        // GFP reads as almost a straight cylinder
var BARREL_RIM_RY = 30;
var BARREL_MAX_W = 46;
var BARREL_MIN_W = 6;
var BARREL_SEGMENTS = 18;       // 60 in the Python mockup; trimmed for mobile perf
var BARREL_BADGE_VISIBLE_DEPTH = -0.05;
var BARREL_GRAY_FRONT = "rgb(152,152,152)";
var BARREL_GRAY_BACK = "rgb(116,116,116)";
var BARREL_ROTATE_SENSITIVITY = 0.4; // degrees rotated per px dragged

// Deterministic PRNG so every strand gets the same organic per-strand
// jitter (twist, bulge, loop reach...) on every rebuild without persisting
// extra state. JS has no seedable Math.random and bit-exact match with the
// Python mockup's random.seed(11) isn't the goal - just a stable,
// visually-equivalent mix across the 10 strands.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function barrelRand(rng, lo, hi) { return lo + rng() * (hi - lo); }

function buildBarrelStrandParams(areas) {
  var rng = mulberry32(11);
  var n = areas.length;
  var params = [];
  var acc = 0;
  for (var i = 0; i < n; i++) {
    var spacingJitter = barrelRand(rng, -6, 6);
    acc += (360 / n) + spacingJitter / n;
    params.push({
      base_angle: acc,
      twist: barrelRand(rng, 78, 122),
      radius_mult: barrelRand(rng, 0.92, 1.07),
      top_t_offset: barrelRand(rng, -0.04, 0.08),
      bot_t_offset: barrelRand(rng, -0.07, 0.05),
      bulge_phase: barrelRand(rng, -0.08, 0.08),
      bulge_amt: barrelRand(rng, 0.85, 1.2),
      top_flare: barrelRand(rng, 0.8, 1.6),
      bot_flare: barrelRand(rng, 0.8, 1.6),
      top_loop_len: barrelRand(rng, 0.9, 3.2),
      bot_loop_len: barrelRand(rng, 0.9, 3.2)
    });
  }
  var offset0 = params[0].base_angle;
  params.forEach(function (p) { p.base_angle = p.base_angle - offset0 - 90; });
  return params;
}

function barrelRadiusProfile(t) {
  // 0 at the ends, 1 at the middle - clamp t and the sine before the
  // fractional power (a small negative float ** 0.85 is complex/NaN).
  var tt = Math.max(0, Math.min(1, t));
  var s = Math.max(0, Math.sin(Math.PI * tt));
  return 1 + BARREL_BULGE * Math.pow(s, 0.85);
}

// x/y/depth of point t (0 = top end, 1 = bottom end) along strand sp, at
// the barrel's current rotation.
function barrelStrandPoint(sp, t, rotationDeg, cx) {
  var tEff = sp.top_t_offset + t * (1 - sp.top_t_offset + sp.bot_t_offset);
  var angDeg = sp.base_angle + rotationDeg + sp.twist * tEff;
  var ang = (angDeg * Math.PI) / 180;
  var prof = barrelRadiusProfile(t + sp.bulge_phase);
  prof = 1 + (prof - 1) * sp.bulge_amt;
  var r = BARREL_RADIUS * sp.radius_mult * prof;
  return {
    x: cx + r * Math.sin(ang),
    y: BARREL_TOP_Y + (BARREL_BOT_Y - BARREL_TOP_Y) * t,
    depth: Math.cos(ang)
  };
}

function hexToRgbArr(hex) {
  hex = hex.replace("#", "");
  return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
}

function barrelShade(rgb, depth) {
  var out;
  if (depth >= 0) {
    out = rgb.map(function (c) { return Math.round(c + (255 - c) * (0.28 * depth)); });
  } else {
    out = rgb.map(function (c) { return Math.round(c * (1 - 0.55 * -depth)); });
  }
  return "rgb(" + out[0] + "," + out[1] + "," + out[2] + ")";
}

// Live element pools + rotation state for the currently-built barrel, so
// renderBarrelFrame() can update (not recreate) elements on every drag
// frame - rebuilding ~200 DOM nodes per pointermove would be far too slow
// for a continuous touch gesture.
var barrelAreas = null;
var barrelStrandParams = null;
var barrelCx = BARREL_W / 2;
var barrelStripesG = null;
var barrelSegEls = [];    // [strandIdx][segIdx] -> <polygon>
var barrelLoopEls = [];   // [strandIdx] -> {top: <path>, bot: <path>}
var barrelBadgeEls = [];  // [strandIdx] -> {circle, text}
var barrelStationEls = {}; // modId -> {dot, labels: [{el, lineIndex}], areaIdx, t}

var barrelPointerState = null; // {x, startRotation, moved}
var barrelDragSuppressClick = false;
var barrelRedrawScheduled = false;
var barrelRotateRAF = null;
var barrelPointerMoveHandler = null;
var barrelPointerUpHandler = null;

function buildWheelMap(app) {
  var areas = state.data.areas;
  var perArea = wheelPerArea();
  barrelAreas = areas;
  barrelStrandParams = buildBarrelStrandParams(areas);
  barrelCx = BARREL_W / 2;

  // MOBILE_LAYOUT.viewBox is read all over this file (fitMapToContainer,
  // fullViewBoxArray) - mutating this one property (const only locks the
  // variable binding, not the object's contents) keeps all of those working
  // against the barrel's fixed canvas with zero further changes. Unlike the
  // old wheel, the barrel's canvas size doesn't depend on station counts -
  // stations sit along each strand's body, not out past its end.
  MOBILE_LAYOUT.viewBox = "0 0 " + BARREL_W + " " + BARREL_H;

  var svg = svgEl("svg", { id: "subway-map", viewBox: MOBILE_LAYOUT.viewBox });
  var mapContent = svgEl("g", { id: "map-content" });
  svg.appendChild(mapContent);

  // Decorative cask-outline rims (top/mid/bottom) - purely cosmetic, suggest
  // the 3D silhouette the way the Python mockup's guide ellipses did.
  var rimsG = svgEl("g", { id: "barrel-rims" });
  mapContent.appendChild(rimsG);
  [BARREL_TOP_Y, (BARREL_TOP_Y + BARREL_BOT_Y) / 2, BARREL_BOT_Y].forEach(function (ry) {
    rimsG.appendChild(svgEl("ellipse", {
      cx: barrelCx, cy: ry, rx: BARREL_RADIUS, ry: BARREL_RIM_RY * 0.5,
      fill: "none", stroke: "#ccc", "stroke-width": 1.4, "pointer-events": "none"
    }));
  });

  // Strand ribbon segments + loop ends: a fixed pool of polygons/paths per
  // strand. renderBarrelFrame() depth-sorts and re-appends these (moving,
  // not cloning, existing nodes) every frame for correct painter's-
  // algorithm occlusion as strands cross each other while rotating.
  barrelStripesG = svgEl("g", { id: "barrel-strands" });
  mapContent.appendChild(barrelStripesG);
  barrelSegEls = [];
  barrelLoopEls = [];
  areas.forEach(function (area, i) {
    var segRow = [];
    for (var s = 0; s < BARREL_SEGMENTS; s++) {
      var poly = svgEl("polygon", { points: "0,0 0,0 0,0 0,0", "data-area": area.id });
      poly.addEventListener("click", function () {
        if (barrelDragSuppressClick) return;
        selectArea(area.id);
      });
      barrelStripesG.appendChild(poly);
      segRow.push(poly);
    }
    barrelSegEls.push(segRow);

    // Loops rendered as a single stroked bezier path per end (round
    // linecap) rather than the Python mockup's chain of overlapping
    // circles - tube_r is constant along one loop's short reach (depth
    // barely varies), so a stroked path gives the identical "solid rounded
    // coil" look with one DOM node instead of ~25.
    var loops = {};
    ["top", "bot"].forEach(function (which) {
      var loopEl = svgEl("path", { d: "M0 0", fill: "none", "stroke-linecap": "round", "data-area": area.id });
      loopEl.addEventListener("click", function () {
        if (barrelDragSuppressClick) return;
        selectArea(area.id);
      });
      barrelStripesG.appendChild(loopEl);
      loops[which] = loopEl;
    });
    barrelLoopEls.push(loops);
  });

  // Station dots + labels - same data-station/data-station-label
  // attributes and hidden-station/selected classes the metro map already
  // uses, so applyFocusState's existing highlight/fade logic needs zero
  // changes to keep driving them here.
  var stationsG = svgEl("g", { id: "barrel-stations" });
  mapContent.appendChild(stationsG);
  barrelStationEls = {};
  areas.forEach(function (area, areaIdx) {
    var list = perArea[area.id].filter(function (mod) { return mod.areas[0] === area.id; });
    var count = list.length;
    list.forEach(function (mod, idx) {
      // Spread stations along the strand's body (t 0.16-0.84), clear of
      // both loop ends, evenly by index - the barrel's analog of the flat
      // wheel's outward per-index radius spacing.
      var t = count > 0 ? 0.16 + (0.68 * (idx + 1)) / (count + 1) : 0.5;
      var isInterchange = mod.areas.length > 1;
      var dot = svgEl("circle", {
        cx: barrelCx, cy: BARREL_TOP_Y, r: isInterchange ? 13 : 10,
        class: "station-dot hidden-station" + (isInterchange ? " interchange-dot" : ""),
        fill: isInterchange ? "#fff" : area.color,
        stroke: "#111",
        "stroke-width": isInterchange ? 4 : 1.5,
        "data-station": mod.id
      });
      dot.addEventListener("click", function () {
        if (barrelDragSuppressClick) return;
        selectStation(mod.id);
      });
      stationsG.appendChild(dot);

      var lines = wrapLabel(mod.name);
      var midIndex = (lines.length - 1) / 2;
      var labelEls = lines.map(function (lineText, i) {
        var label = svgEl("text", {
          x: barrelCx, y: BARREL_TOP_Y,
          class: "station-label hidden-station",
          "data-station-label": mod.id
        });
        label.textContent = lineText;
        stationsG.appendChild(label);
        return { el: label, lineIndex: i - midIndex };
      });

      barrelStationEls[mod.id] = { dot: dot, labels: labelEls, areaIdx: areaIdx, t: t };
    });
  });

  // Area badges - only actually visible once their strand has rotated far
  // enough to face the viewer (see renderBarrelFrame's depth gate); this IS
  // the mechanism behind April's "the further end line can be clickable
  // [once rotated into view]" request.
  var badgesG = svgEl("g", { id: "barrel-badges" });
  mapContent.appendChild(badgesG);
  barrelBadgeEls = [];
  areas.forEach(function (area) {
    var badge = svgEl("circle", {
      cx: barrelCx, cy: BARREL_TOP_Y, r: 16, fill: area.color,
      class: "area-badge", "data-area": area.id
    });
    badge.addEventListener("click", function () {
      if (barrelDragSuppressClick) return;
      selectArea(area.id);
    });
    badgesG.appendChild(badge);
    var badgeText = svgEl("text", {
      x: barrelCx, y: BARREL_TOP_Y, "text-anchor": "middle",
      class: "area-badge-text", "data-area": area.id
    });
    badgeText.textContent = area.abbr || area.name.slice(0, 2).toUpperCase();
    badgeText.addEventListener("click", function () {
      if (barrelDragSuppressClick) return;
      selectArea(area.id);
    });
    badgesG.appendChild(badgeText);
    barrelBadgeEls.push({ circle: badge, text: badgeText });
  });

  app.innerHTML = "";
  app.appendChild(svg);

  setupBarrelDrag(svg);
  renderBarrelFrame();
}

function drawBarrelLoop(pathEl, p0, sign, dirx, flare, loopLen, rgb, colored) {
  var tubeR = 3.4 + 1.6 * Math.max(0, p0.depth);
  var reach = 46 * loopLen;
  var p1x = p0.x + dirx * 16 * flare, p1y = p0.y + sign * reach * 0.32;
  var p2x = p0.x + dirx * 20 * flare, p2y = p0.y + sign * reach * 0.78;
  var p3x = p0.x + dirx * 4 * flare, p3y = p0.y + sign * reach;
  var d = "M " + p0.x + " " + p0.y + " C " + p1x + " " + p1y + ", " + p2x + " " + p2y + ", " + p3x + " " + p3y;
  var col = colored ? barrelShade(rgb, p0.depth) : "rgb(168,168,168)";
  pathEl.setAttribute("d", d);
  pathEl.setAttribute("stroke", col);
  pathEl.setAttribute("stroke-width", tubeR * 2);
}

// Recomputes every barrel element's position/color for the current
// state.barrelRotation + state.selectedArea, reusing the DOM pool built in
// buildWheelMap. Called continuously during a drag gesture, during the
// rotate-to-front animation, and once after any selection change (via
// applyFocusState's hook) so highlight/fade colors stay in sync even when
// nothing is currently being dragged.
function renderBarrelFrame() {
  if (!isWheelMode() || !barrelStrandParams || !barrelStripesG) return;
  var areas = barrelAreas;
  var rotation = state.barrelRotation || 0;
  var selectedArea = state.selectedArea;
  var allColored = !selectedArea;
  var allSegs = [];

  areas.forEach(function (area, i) {
    var sp = barrelStrandParams[i];
    var rgb = hexToRgbArr(area.color);
    var colored = allColored || selectedArea === area.id;
    var prevPt = barrelStrandPoint(sp, 0, rotation, barrelCx);
    for (var s = 0; s < BARREL_SEGMENTS; s++) {
      var t1 = (s + 1) / BARREL_SEGMENTS;
      var pt = barrelStrandPoint(sp, t1, rotation, barrelCx);
      var avgDepth = (prevPt.depth + pt.depth) / 2;
      var w0 = Math.max(BARREL_MIN_W, BARREL_MAX_W * sp.radius_mult * Math.abs(prevPt.depth));
      var w1 = Math.max(BARREL_MIN_W, BARREL_MAX_W * sp.radius_mult * Math.abs(pt.depth));
      var col = colored ? barrelShade(rgb, avgDepth) : (avgDepth >= 0 ? BARREL_GRAY_FRONT : BARREL_GRAY_BACK);
      var poly = barrelSegEls[i][s];
      poly.setAttribute("points",
        (prevPt.x - w0 / 2) + "," + prevPt.y + " " +
        (pt.x - w1 / 2) + "," + pt.y + " " +
        (pt.x + w1 / 2) + "," + pt.y + " " +
        (prevPt.x + w0 / 2) + "," + prevPt.y);
      poly.setAttribute("fill", col);
      allSegs.push({ depth: avgDepth, el: poly });
      prevPt = pt;
    }

    var top0 = barrelStrandPoint(sp, 0, rotation, barrelCx);
    var bot0 = barrelStrandPoint(sp, 1, rotation, barrelCx);
    var dirx = (i % 2 === 0) ? 1 : -1;
    drawBarrelLoop(barrelLoopEls[i].top, top0, -1, dirx, sp.top_flare, sp.top_loop_len, rgb, colored);
    drawBarrelLoop(barrelLoopEls[i].bot, bot0, 1, -dirx, sp.bot_flare, sp.bot_loop_len, rgb, colored);
    allSegs.push({ depth: Math.max(-0.3, top0.depth), el: barrelLoopEls[i].top });
    allSegs.push({ depth: Math.max(-0.3, bot0.depth), el: barrelLoopEls[i].bot });
  });

  // Painter's algorithm: re-appending an existing node moves it (doesn't
  // clone it) to the end of its parent, reordering the whole pool
  // back-to-front with no element creation/destruction on any frame.
  allSegs.sort(function (a, b) { return a.depth - b.depth; });
  allSegs.forEach(function (seg) { barrelStripesG.appendChild(seg.el); });

  areas.forEach(function (area, i) {
    var sp = barrelStrandParams[i];
    var top0 = barrelStrandPoint(sp, 0, rotation, barrelCx);
    var rgb = hexToRgbArr(area.color);
    var b = barrelBadgeEls[i];
    var visible = top0.depth > BARREL_BADGE_VISIBLE_DEPTH;
    b.circle.classList.toggle("barrel-badge-hidden", !visible);
    b.text.classList.toggle("barrel-badge-hidden", !visible);
    if (visible) {
      var by = top0.y - 78;
      b.circle.setAttribute("cx", top0.x); b.circle.setAttribute("cy", by);
      b.text.setAttribute("x", top0.x); b.text.setAttribute("y", by);
      b.circle.setAttribute("fill", barrelShade(rgb, top0.depth));
    }
  });

  Object.keys(barrelStationEls).forEach(function (modId) {
    var st = barrelStationEls[modId];
    var sp = barrelStrandParams[st.areaIdx];
    var pt = barrelStrandPoint(sp, st.t, rotation, barrelCx);
    st.dot.setAttribute("cx", pt.x);
    st.dot.setAttribute("cy", pt.y);
    var dotSide = pt.x >= barrelCx ? 1 : -1;
    var r = st.dot.classList.contains("interchange-dot") ? 13 : 10;
    var labelX = pt.x + dotSide * (r + 8);
    var anchor = dotSide > 0 ? "start" : "end";
    st.labels.forEach(function (item) {
      item.el.setAttribute("x", labelX);
      item.el.setAttribute("y", pt.y + item.lineIndex * LABEL_LINE_GAP + 5);
      item.el.setAttribute("text-anchor", anchor);
    });
  });
}

function scheduleBarrelRedraw() {
  if (barrelRedrawScheduled || typeof requestAnimationFrame !== "function") {
    if (typeof requestAnimationFrame !== "function") renderBarrelFrame();
    return;
  }
  barrelRedrawScheduled = true;
  requestAnimationFrame(function () {
    barrelRedrawScheduled = false;
    renderBarrelFrame();
  });
}

// Touch/mouse drag-to-rotate. Uses pointer events (covers both touch and
// mouse in one listener) on document for move/up so a drag that slides off
// the svg's edges - very easy on a small phone screen - still tracks
// correctly instead of stopping dead at the boundary. Re-attaching on every
// buildWheelMap call removes the previous handlers first so rebuilds (e.g.
// a resize crossing the mobile breakpoint) don't stack duplicate listeners.
function setupBarrelDrag(svg) {
  if (barrelPointerMoveHandler) document.removeEventListener("pointermove", barrelPointerMoveHandler);
  if (barrelPointerUpHandler) {
    document.removeEventListener("pointerup", barrelPointerUpHandler);
    document.removeEventListener("pointercancel", barrelPointerUpHandler);
  }

  svg.addEventListener("pointerdown", function (e) {
    if (barrelRotateRAF) { cancelAnimationFrame(barrelRotateRAF); barrelRotateRAF = null; }
    barrelPointerState = { x: e.clientX, startRotation: state.barrelRotation || 0, moved: false };
  });

  barrelPointerMoveHandler = function (e) {
    if (!barrelPointerState) return;
    var dx = e.clientX - barrelPointerState.x;
    if (Math.abs(dx) > 4) barrelPointerState.moved = true;
    if (!barrelPointerState.moved) return;
    e.preventDefault();
    state.barrelRotation = barrelPointerState.startRotation + dx * BARREL_ROTATE_SENSITIVITY;
    scheduleBarrelRedraw();
  };
  // A drag that moved past the threshold shouldn't also fire the badge/dot/
  // strand click that lands under the finger on release - barrelDragSuppressClick
  // is checked at the top of every barrel click handler above and cleared
  // on the next tick (after the browser's own click event, if any, fires).
  barrelPointerUpHandler = function () {
    if (barrelPointerState && barrelPointerState.moved) {
      barrelDragSuppressClick = true;
      setTimeout(function () { barrelDragSuppressClick = false; }, 0);
    }
    barrelPointerState = null;
  };
  document.addEventListener("pointermove", barrelPointerMoveHandler, { passive: false });
  document.addEventListener("pointerup", barrelPointerUpHandler);
  document.addEventListener("pointercancel", barrelPointerUpHandler);
  svg.style.touchAction = "none";
}

// Tapping an area's badge/strand/station rotates that strand to face the
// viewer head-on (its t=0.5 midpoint reaches depth=1) - replaces the flat
// wheel's zoom-to-spoke behavior, since a barrel doesn't zoom, it turns.
function rotateBarrelToFront(areaId) {
  if (!barrelAreas || !barrelStrandParams) return;
  var i = -1;
  for (var k = 0; k < barrelAreas.length; k++) {
    if (barrelAreas[k].id === areaId) { i = k; break; }
  }
  if (i === -1) return;
  var sp = barrelStrandParams[i];
  var tEffMid = sp.top_t_offset + 0.5 * (1 - sp.top_t_offset + sp.bot_t_offset);
  var target = -(sp.base_angle + sp.twist * tEffMid);
  var current = state.barrelRotation || 0;
  // Shortest angular path to an equivalent target (mod 360), so a strand
  // already close to front never spins the long way around to get there.
  var diff = ((target - current + 180) % 360 + 360) % 360 - 180;
  var targetRotation = current + diff;

  if (barrelRotateRAF) cancelAnimationFrame(barrelRotateRAF);
  if (typeof requestAnimationFrame !== "function") {
    state.barrelRotation = targetRotation;
    renderBarrelFrame();
    return;
  }
  var start = current;
  var t0 = (typeof performance !== "undefined" ? performance.now() : Date.now());
  var dur = 450;
  function step(now) {
    var t = Math.min(1, (now - t0) / dur);
    var e = 1 - Math.pow(1 - t, 3);
    state.barrelRotation = start + (targetRotation - start) * e;
    renderBarrelFrame();
    barrelRotateRAF = t < 1 ? requestAnimationFrame(step) : null;
  }
  barrelRotateRAF = requestAnimationFrame(step);
}

function buildMap(app) {
  if (isWheelMode()) {
    buildWheelMap(app);
    return;
  }
  var svg = svgEl("svg", { id: "subway-map", viewBox: LAYOUT.viewBox });

  var vbParts = LAYOUT.viewBox.split(" ");

  // 2026-08-06: April reported the river/light-streak overshoot (see
  // buildCityBackground) still bled past the map edges even after the CSS
  // overflow:hidden fix on #subway-map - the CSS 'overflow' property's
  // behavior on a root/outermost <svg> is genuinely inconsistent across
  // browsers, so relying on it alone wasn't reliable. This is a second,
  // SVG-native clip that doesn't depend on that CSS behavior at all: a
  // <clipPath> matching the viewBox rectangle.
  //
  // 2026-08-07: April saw the sun/road overshoot again on mobile Safari
  // (turning the city background back on for phones - see the .city-bg
  // mobile media-query removal - made this visible there for the first
  // time). Applying clip-path directly to the ROOT <svg> element (as this
  // did before) is a less-common pattern than clipping a child <g> -
  // several WebKit/Safari versions have had inconsistent support for
  // clip-path on the outermost svg specifically. Now every piece of map
  // content (background, city art, lines, stations, badges, legend) is
  // appended to an inner <g id="map-content"> instead, with the clip-path
  // on THAT group - clipping a normal child element is the well-supported,
  // conventional use of SVG clip-path, so this doesn't depend on the
  // root-svg edge case at all. Belt-and-suspenders with the CSS
  // overflow:hidden rule, but this is the mechanism actually guaranteeing
  // it.
  var clipDefs = svgEl("defs", {});
  var mapClip = svgEl("clipPath", { id: "map-viewbox-clip" });
  mapClip.appendChild(svgEl("rect", {
    x: vbParts[0], y: vbParts[1], width: vbParts[2], height: vbParts[3]
  }));
  clipDefs.appendChild(mapClip);
  svg.appendChild(clipDefs);
  var mapContent = svgEl("g", { id: "map-content", "clip-path": "url(#map-viewbox-clip)" });
  svg.appendChild(mapContent);

  // 2026-08-05: replaced the "Blueprint Grid" background (2026-08-03,
  // April's chosen Option C) with a full-bleed illustrated city backdrop
  // per April's request to make the map "like a real city map" - see
  // buildCityBackground below for the skyline/river/bridges themselves.
  mapContent.appendChild(svgEl("rect", {
    x: vbParts[0], y: vbParts[1], width: vbParts[2], height: vbParts[3],
    fill: "url(#city-sky-grad)", class: "map-background"
  }));
  buildCityBackground(mapContent, vbParts);

  var stationPoints = buildStationPointSet();

  state.data.areas.forEach(function (area) {
    var path = LAYOUT.linePaths[area.id];
    if (!path) return;
    var pts = parsePoints(path);
    var line = svgEl("path", {
      d: roundedPathD(pts, CORNER_RADIUS, stationPoints),
      class: "line-path",
      stroke: area.color,
      fill: "none",
      "data-area": area.id
    });
    line.addEventListener("click", function () {
      selectArea(area.id);
    });
    mapContent.appendChild(line);
  });

  // Only the small color badge + abbreviation appears inline on each
  // line now (no more full spelled-out name floating on the map) - the
  // full name mapping lives in the single corner legend box instead
  // (see renderMapLegendBox below).
  state.data.areas.forEach(function (area) {
    var pos = LAYOUT.areaLabelPos[area.id];
    if (!pos) return;

    var badge = svgEl("circle", {
      cx: pos.x,
      cy: pos.y - 6,
      // widened from 11 to 16 - at 11 the bold 2-letter abbreviation text
      // reached (or slightly passed) the circle's own edge
      r: 16,
      fill: area.color,
      class: "area-badge",
      "data-area": area.id
    });
    badge.addEventListener("click", function () {
      selectArea(area.id);
    });
    mapContent.appendChild(badge);

    var badgeText = svgEl("text", {
      x: pos.x,
      y: pos.y - 1,
      "text-anchor": "middle",
      class: "area-badge-text",
      "data-area": area.id
    });
    badgeText.textContent = area.abbr || area.name.slice(0, 2).toUpperCase();
    badgeText.addEventListener("click", function () {
      selectArea(area.id);
    });
    mapContent.appendChild(badgeText);
  });

  state.data.modalities.forEach(function (mod) {
    var pos = LAYOUT.stationPos[mod.id];
    if (!pos) return;
    var isInterchange = mod.areas.length > 1;
    var primaryArea = state.data.areas.filter(function (a) {
      return a.id === mod.areas[0];
    })[0];
    var primaryColor = primaryArea ? primaryArea.color : "#333";

    // Stations shared by N lines get a rounded-pill marker sized to hold
    // all N color dots (one per sharing line, in content.json's areas
    // order) with a visible gap to the border - like the NYC subway map's
    // interchange markers - instead of a plain circle that only reads as
    // one line. The pill grows taller as N grows so the dots never crowd.
    var shareCount = mod.areas.length;
    var multiTone = shareCount > 1;
    var dotSpacing = 12;
    // 2026-08-10: the mobile "vertical-first" redesign stacks each
    // interchange's dots HORIZONTALLY (left-to-right, at the x its own
    // line actually approaches from) instead of the old fixed-20px-wide
    // vertical stack - a wide pill can hold any number of dots at a
    // single row height instead of growing taller. LAYOUT.pillGeometry
    // carries this per-station width/height/dot-offset data; it's only
    // present on MOBILE_LAYOUT, so DESKTOP_LAYOUT (and any other layout
    // without it) transparently keeps the original vertical-stack sizing.
    var pillGeo = LAYOUT.pillGeometry && LAYOUT.pillGeometry[mod.id];
    var pillW = pillGeo ? pillGeo.pillW : 20;
    var pillH = pillGeo ? pillGeo.pillH : 24 + (shareCount - 1) * dotSpacing;
    var dot;
    if (multiTone) {
      dot = svgEl("rect", {
        x: pos.x - pillW / 2,
        y: pos.y - pillH / 2,
        width: pillW,
        height: pillH,
        rx: 10,
        class: "station-dot interchange-dot square-dot",
        fill: "#fff",
        stroke: "#111",
        "stroke-width": 4,
        "data-station": mod.id
      });
    } else {
      dot = svgEl("circle", {
        cx: pos.x,
        cy: pos.y,
        r: isInterchange ? 11 : 6,
        class: "station-dot hidden-station" + (isInterchange ? " interchange-dot" : ""),
        fill: "#fff",
        stroke: isInterchange ? "#111" : primaryColor,
        "stroke-width": isInterchange ? 4 : 3,
        "data-station": mod.id
      });
    }
    dot.addEventListener("click", function (e) {
      e.stopPropagation();
      selectStation(mod.id);
    });
    mapContent.appendChild(dot);

    // One small color dot per sharing line, marking exactly which lines
    // meet at this station - like the NYC map's interchange color
    // indicators. With pillGeo present (mobile), dots stack HORIZONTALLY,
    // each at its own line's real approach x (dotX, keyed by area id);
    // without it (desktop), dots keep the original vertical stack in
    // content.json's areas order.
    if (multiTone) {
      var toneColors = mod.areas.map(function (areaId) {
        var a = state.data.areas.filter(function (ar) { return ar.id === areaId; })[0];
        return a ? a.color : "#333";
      });
      var toneStart = -((shareCount - 1) / 2) * dotSpacing;

      function toneDotPos(areaId, ti) {
        if (pillGeo && pillGeo.dotX && areaId in pillGeo.dotX) {
          return { x: pos.x + pillGeo.dotX[areaId], y: pos.y };
        }
        return { x: pos.x, y: pos.y + toneStart + ti * dotSpacing };
      }

      // The pill's opaque white fill hides the real colored line for the
      // stretch between the pill's border and each dot, leaving a blank
      // gap - a rounded corner never actually reaches its own vertex
      // either, so tightening it can't close that gap (see the RNAi
      // Therapeutics fix history above). Instead of a blank gap, redraw
      // that hidden stretch as a dashed line in the same color, on top of
      // the white fill, so the connection from border to dot (and through
      // to the opposite border, for lines that pass all the way through)
      // is visible rather than implied.
      var crossings = LAYOUT.pillCrossings && LAYOUT.pillCrossings[mod.id];
      if (crossings) {
        // inset 2px from the raw rect edge (half the border's 4px stroke
        // width) so the dashes stay inside the white fill and don't draw
        // on top of / interrupt the black border itself
        var pillLeft = pos.x - pillW / 2 + 2;
        var pillRight = pos.x + pillW / 2 - 2;
        var pillTop = pos.y - pillH / 2 + 2;
        var pillBottom = pos.y + pillH / 2 - 2;

        // 2026-08-10: mobile's crossings are keyed by area id (an object,
        // { areaId: [sides] }) rather than desktop's toneIndex array
        // ([{toneIndex, sides}]) - order-independent, since content.json's
        // mod.areas order doesn't always match the sketch's left-to-right
        // dot order (see build_vertical2.py's DOT_ORDER). Normalize both
        // shapes into one {areaId, color, sides, dotPos} list so the draw
        // loop below doesn't need to care which layout it's on.
        var crossingList = [];
        if (Array.isArray(crossings)) {
          crossings.forEach(function (c) {
            var areaId = mod.areas[c.toneIndex];
            crossingList.push({
              areaId: areaId, sides: c.sides,
              color: toneColors[c.toneIndex], dotPos: toneDotPos(areaId, c.toneIndex)
            });
          });
        } else {
          Object.keys(crossings).forEach(function (areaId) {
            var ti = mod.areas.indexOf(areaId);
            crossingList.push({
              areaId: areaId, sides: crossings[areaId],
              color: ti !== -1 ? toneColors[ti] : "#333", dotPos: toneDotPos(areaId, ti)
            });
          });
        }

        crossingList.forEach(function (c) {
          var dotX = c.dotPos.x, dotY = c.dotPos.y;
          var color = c.color;
          (c.sides || []).forEach(function (side) {
            var x1 = dotX, y1 = dotY, x2 = dotX, y2 = dotY;
            if (side === "left") { x1 = pillLeft; }
            else if (side === "right") { x2 = pillRight; }
            else if (side === "top") { y1 = pillTop; }
            else if (side === "bottom") { y2 = pillBottom; }
            // 2026-08-06: April found the blank white pills weird in the
            // overview - these used to start hidden (class included
            // "hidden-station") and only appear once that line was
            // selected. Dropped that class so the dashes render immediately.
            mapContent.appendChild(svgEl("line", {
              x1: x1, y1: y1, x2: x2, y2: y2,
              stroke: color, "stroke-width": 2, "stroke-dasharray": "1.5,1.5",
              "stroke-linecap": "butt",
              class: "pill-crossing",
              "data-station-tone": mod.id
            }));
          });
        });
      }

      mod.areas.forEach(function (areaId, ti) {
        var color = toneColors[ti];
        var dp = toneDotPos(areaId, ti);
        var toneDot = svgEl("circle", {
          cx: dp.x,
          cy: dp.y,
          r: 3.5,
          fill: color,
          class: "tone-dot",
          "data-station-tone": mod.id
        });
        mapContent.appendChild(toneDot);
      });
    }

    var lines = wrapLabel(mod.name);
    var labelBelow = LAYOUT.labelBelow && LAYOUT.labelBelow.indexOf(mod.id) !== -1;
    // multiTone markers grow taller with more sharing lines, so labels
    // placed below them need clearance that scales with the actual pill
    // height rather than a fixed constant.
    var haloHalf = multiTone ? pillH / 2 : (isInterchange ? 11 : 6);
    // Clearance now scales with the marker's actual size on BOTH sides
    // (above and below) instead of only the below-branch scaling with
    // pillH - large multi-tone pills (like Targeted mAb's 5-dot pill) were
    // getting a label placed using the same fixed offset as a tiny plain
    // dot, so the label sat inside the pill itself.
    var clearance = haloHalf + (lines.length > 1 ? 16 : 8);
    // For "below" placement, line 0 (the nearest to the dot) sits right at
    // the clearance gap, with any additional lines stacking further away.
    // For "above" placement, lines still stack top-to-bottom in reading
    // order, so the line NEAREST the dot is the LAST one - shift the whole
    // block up by the extra stacked lines so that last line, not line 0,
    // is the one sitting at the clearance gap. Otherwise multi-line labels
    // placed above ended up much closer to the dot than the same label
    // would sit if placed below (e.g. ARNI above its dot vs. DOAC below).
    var baseY = labelBelow
      ? pos.y + clearance
      : pos.y - clearance - (lines.length - 1) * LABEL_LINE_GAP;
    baseY += (LAYOUT.labelOffsetY && LAYOUT.labelOffsetY[mod.id]) || 0;
    var labelX = pos.x + ((LAYOUT.labelOffsetX && LAYOUT.labelOffsetX[mod.id]) || 0);
    // The line NEAREST the dot (line 0 for "below" labels, the last line
    // for "above" labels - see the comment above) is the anchor: its
    // position must never move, since it's what's spatially tied to the
    // dot. Every other line is stored as a signed distance (in line-count,
    // not pixels) from that anchor, so updateLabelLineSpacing() can redraw
    // just the far line(s) at whatever gap the current font-size calls for
    // (base/line-focused/selected) without disturbing the anchor line.
    var anchorY = labelBelow ? baseY : baseY + (lines.length - 1) * LABEL_LINE_GAP;
    var dir = labelBelow ? 1 : -1;
    lines.forEach(function (lineText, i) {
      var dist = labelBelow ? i : (lines.length - 1 - i);
      var label = svgEl("text", {
        x: labelX,
        y: anchorY + dir * dist * LABEL_LINE_GAP,
        "text-anchor": "middle",
        class: "station-label hidden-station",
        "data-station-label": mod.id,
        "data-anchor-y": anchorY,
        "data-dist": dist,
        "data-dir": dir
      });
      label.textContent = lineText;
      mapContent.appendChild(label);
    });

    if (mod.stubOnly) {
      var sub = svgEl("text", {
        x: pos.x,
        y: pos.y + 24,
        "text-anchor": "middle",
        class: "station-sublabel hidden-station",
        "data-station-sublabel": mod.id
      });
      sub.textContent = "stub - content pending";
      mapContent.appendChild(sub);
    }
  });

  renderMapLegendBox(mapContent);
  setupMapPanning(svg);

  app.innerHTML = "";
  app.appendChild(svg);
}

// ---- Drag-to-pan (2026-08-02) ----
// While a line is zoomed in, other lines can end up mostly or fully
// outside the current viewBox - previously the only way to reach one was
// clicking "All lines" and re-selecting from the overview. This lets you
// click-and-drag the SAME zoomed-in view around (without resetting the
// zoom level) to bring a different line into reach and click straight
// into it. Deliberately mouse-only (not touch) so the existing mobile
// "swipe to see the full line" native horizontal scroll (#app's
// overflow-x, .scroll-hint) keeps working exactly as before - adding
// custom touch panning on top of that would fight the browser's own
// scroll gesture.
var PAN_CLICK_THRESHOLD = 6; // px of mouse movement before a press counts
// as a drag instead of a click, so ordinary station/line/badge clicks
// (which don't move the mouse) are completely unaffected.

function setupMapPanning(svg) {
  var pan = null;

  function currentViewBox() {
    return svg.getAttribute("viewBox").split(" ").map(parseFloat);
  }

  // Keeps the dragged view inside the full map's own bounds, same as the
  // full map used for the "All lines" overview - you can pan freely
  // between lines but never past the map's outer edge.
  function clampViewBox(vb) {
    var full = fullViewBoxArray();
    var w = vb[2], h = vb[3];
    var maxX = Math.max(full[0], full[0] + full[2] - w);
    var maxY = Math.max(full[1], full[1] + full[3] - h);
    var x = Math.min(Math.max(vb[0], full[0]), maxX);
    var y = Math.min(Math.max(vb[1], full[1]), maxY);
    return [x, y, w, h];
  }

  function onMouseMove(e) {
    if (!pan) return;
    var dx = e.clientX - pan.startClientX;
    var dy = e.clientY - pan.startClientY;
    if (!pan.dragging && Math.hypot(dx, dy) > PAN_CLICK_THRESHOLD) {
      pan.dragging = true;
      svg.classList.add("panning");
    }
    if (!pan.dragging) return;
    var rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    // Convert screen-pixel mouse movement into viewBox units using the
    // current zoom's own scale, so panning feels equally responsive to
    // the cursor whether zoomed way in on one line or viewing the whole
    // map. Dragging right reveals content that was off to the left, i.e.
    // the viewBox's own x/y move opposite to the mouse.
    var scaleX = pan.startViewBox[2] / rect.width;
    var scaleY = pan.startViewBox[3] / rect.height;
    var next = clampViewBox([
      pan.startViewBox[0] - dx * scaleX,
      pan.startViewBox[1] - dy * scaleY,
      pan.startViewBox[2],
      pan.startViewBox[3]
    ]);
    svg.setAttribute("viewBox", next.join(" "));
  }

  function onMouseUp() {
    if (pan && pan.dragging) {
      svg.classList.remove("panning");
      // A real drag still fires a native "click" on mouseup (browsers
      // don't suppress it just because the mouse moved) - swallow that
      // one click, in the capture phase before it reaches any
      // station/badge/line, so releasing the drag doesn't also select
      // whatever happens to be under the cursor.
      svg.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
      }, { capture: true, once: true });
    }
    pan = null;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  svg.addEventListener("mousedown", function (e) {
    if (e.button !== 0) return; // primary button only
    pan = {
      startClientX: e.clientX,
      startClientY: e.clientY,
      startViewBox: currentViewBox(),
      dragging: false
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  // ---- Touch pinch-zoom + drag-pan (2026-08-05) ----
  // April's phone screenshot showed the legend/detail panel adapting to
  // her screen while the map itself just stayed at a fixed size, forcing
  // the old "swipe to see the full line" native horizontal scroll. She
  // asked for it to feel like a real mobile map app instead - this adds
  // two-finger pinch-to-zoom and one-finger drag-to-pan via touch events,
  // replacing that native scroll (see touch-action:none on #subway-map in
  // style.css, and the updated .scroll-hint copy). A single finger that
  // doesn't move past the same threshold as the mouse version still
  // reaches the browser's normal tap/click, so station/line/badge
  // selection is unaffected - only real drags and pinches are intercepted.
  var MIN_ZOOM_FRACTION = 0.08; // deepest pinch-zoom: 8% of the full map's
  // width - noticeably closer than the per-line auto-zoom ever goes, so
  // pinching in still feels like it's doing something new.
  var touchState = null;

  function touchDist(t1, t2) {
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
  }

  function touchMid(t1, t2) {
    return { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
  }

  function beginTouch(e) {
    var touches = e.touches;
    if (touches.length === 1) {
      touchState = {
        mode: "pan",
        startClientX: touches[0].clientX,
        startClientY: touches[0].clientY,
        startViewBox: currentViewBox(),
        dragging: false
      };
    } else if (touches.length >= 2) {
      var rect = svg.getBoundingClientRect();
      var startVb = currentViewBox();
      var mid = touchMid(touches[0], touches[1]);
      var scaleX = startVb[2] / rect.width;
      var scaleY = startVb[3] / rect.height;
      touchState = {
        mode: "pinch",
        startDist: touchDist(touches[0], touches[1]),
        startViewBox: startVb,
        anchorX: startVb[0] + (mid.x - rect.left) * scaleX,
        anchorY: startVb[1] + (mid.y - rect.top) * scaleY,
        dragging: true
      };
      svg.classList.add("panning");
    } else {
      touchState = null;
    }
  }

  svg.addEventListener("touchstart", function (e) {
    beginTouch(e);
  }, { passive: true });

  svg.addEventListener("touchmove", function (e) {
    if (!touchState) return;

    if (touchState.mode === "pan" && e.touches.length === 1) {
      var t = e.touches[0];
      var dx = t.clientX - touchState.startClientX;
      var dy = t.clientY - touchState.startClientY;
      if (!touchState.dragging && Math.hypot(dx, dy) > PAN_CLICK_THRESHOLD) {
        touchState.dragging = true;
        svg.classList.add("panning");
      }
      if (!touchState.dragging) return;
      e.preventDefault();
      var rect = svg.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var scaleX = touchState.startViewBox[2] / rect.width;
      var scaleY = touchState.startViewBox[3] / rect.height;
      var next = clampViewBox([
        touchState.startViewBox[0] - dx * scaleX,
        touchState.startViewBox[1] - dy * scaleY,
        touchState.startViewBox[2],
        touchState.startViewBox[3]
      ]);
      svg.setAttribute("viewBox", next.join(" "));
    } else if (touchState.mode === "pinch" && e.touches.length >= 2) {
      e.preventDefault();
      var full = fullViewBoxArray();
      var minW = full[2] * MIN_ZOOM_FRACTION;
      var maxW = full[2];
      var minScale = minW / touchState.startViewBox[2];
      var maxScale = maxW / touchState.startViewBox[2];
      var dist = touchDist(e.touches[0], e.touches[1]);
      var rawScale = touchState.startDist / Math.max(dist, 1);
      var scale = Math.min(maxScale, Math.max(minScale, rawScale));
      var newW = touchState.startViewBox[2] * scale;
      var newH = touchState.startViewBox[3] * scale;

      var mid = touchMid(e.touches[0], e.touches[1]);
      var rect = svg.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var newScaleX = newW / rect.width;
      var newScaleY = newH / rect.height;
      var newX = touchState.anchorX - (mid.x - rect.left) * newScaleX;
      var newY = touchState.anchorY - (mid.y - rect.top) * newScaleY;
      var next = clampViewBox([newX, newY, newW, newH]);
      svg.setAttribute("viewBox", next.join(" "));
    } else {
      // finger count changed mid-gesture (e.g. a pinch dropped to one
      // finger) - simplest and most reliable is to just end the current
      // gesture rather than try to seamlessly hand off between modes.
      touchState = null;
      svg.classList.remove("panning");
    }
  }, { passive: false });

  function endTouch(e) {
    if (!touchState) return;
    var wasDragging = touchState.dragging;
    if (e.touches.length === 0) {
      svg.classList.remove("panning");
      if (wasDragging) {
        // Same reasoning as the mouse version: a real drag/pinch can
        // still fire a trailing synthetic click on release - swallow it
        // so lifting your fingers doesn't also select whatever station
        // happens to be under them.
        svg.addEventListener("click", function (ce) {
          ce.stopPropagation();
          ce.preventDefault();
        }, { capture: true, once: true });
      }
      touchState = null;
    } else {
      // Dropped from 2 fingers to 1 (or similar) - end this gesture;
      // the remaining finger starts a fresh gesture on its next move via
      // touchstart's usual path (browsers re-fire touchstart when a new
      // contact point is the only one left in some cases, but to stay
      // robust either way we just clear state here too).
      touchState = null;
      svg.classList.remove("panning");
    }
  }

  svg.addEventListener("touchend", endTouch, { passive: true });
  svg.addEventListener("touchcancel", endTouch, { passive: true });
}

// Single consolidated legend box (bottom-left, like a real transit map's
// corner legend) mapping every abbreviation shown on the map to its full
// area name - since the map itself now only shows abbreviations inline.
// Legend box scale - April compared Current/Medium/Large against the real
// map (animated preview) and picked Medium (1.35x), then asked for the box
// itself to go up to 1.5x. Anchored to the same bottom-right corner margin
// the box has always used (20px from the map's right edge, 10px from the
// bottom), growing up-and-left as it scales.
//
// 2026-08-04: two things fixed/changed together here. (1) the title/badge-
// letter/area-name font sizes used to be hardcoded static CSS px values
// (18.9/12.15/13.5, i.e. baked in for the old 1.35 scale) instead of being
// computed from LEGEND_SCALE like the box/circle geometry already was -
// that's why bumping the scale grew the box and swatch circles but left
// the text sizes frozen. Font sizes are now set inline from LEGEND_SCALE
// so everything grows together. (2) April specifically asked for the
// badge (swatch circle) and its letters to be bigger than a plain
// proportional bump would give, so those two use larger base constants
// than the title/name text (14/10, unchanged base - just newly
// proportional). Went through several rounds landing on +15% for the
// badge circle (10->11.5) with the box kept at the first-boost size
// (h-base 160, row height tightened to 24*s to fit without rows
// overlapping). The letter size was tried at a 5% reduction from +15%
// first (14.2) but "ON" still crowded the circle's edge, so it was
// dropped further to 10.5 - checked against the widest 2-letter
// abbreviation (MB), not just ON, so every badge has real margin.
// 2026-08-08: LEGEND_SCALE and the box's position used to be hardcoded to
// desktop's specific ~2230x1225 viewBox (x:1880, y:1010 = that canvas's own
// bottom-right corner minus a fixed margin) - on the much narrower 1260-wide
// mobile portrait canvas that pushed most of the box off the right edge
// entirely. Both are now derived from the ACTIVE LAYOUT.viewBox: the scale
// shrinks proportionally on narrower canvases (capped at the original 1.5
// so it never grows past desktop's tuned size), and the box anchors to
// that viewBox's own right/bottom edge with the same 100/90px margin
// desktop always used. On desktop this resolves to the exact same
// 1.5 / x:1280 / y:770 as before (no regression); on mobile it now sits
// fully on-canvas near the bottom-right, sized to fit.
var LAYOUT_VB_NOW = LAYOUT.viewBox.split(" ").map(Number);
var LEGEND_SCALE = 1.5 * Math.min(1, LAYOUT_VB_NOW[2] / 2230);
var MAP_LEGEND_BOX = { w: 400 * LEGEND_SCALE, h: 160 * LEGEND_SCALE };
MAP_LEGEND_BOX.x = (LAYOUT_VB_NOW[0] + LAYOUT_VB_NOW[2]) - MAP_LEGEND_BOX.w - 100;
MAP_LEGEND_BOX.y = (LAYOUT_VB_NOW[1] + LAYOUT_VB_NOW[3]) - MAP_LEGEND_BOX.h - 90;

// 2026-08-12: everything this function draws now lives inside its own <g>
// (id="map-legend-box-group") instead of being appended straight onto the
// svg root. Desktop still shows it always-on, same as before (no CSS rule
// hides the group there) - but the mobile full-screen layout needs a way
// to hide/show this box as a whole behind the new #legend-toggle FAB
// (wireLegendToggle below), and toggling one group's class is far simpler
// than toggling display on every rect/circle/text this function creates.
function renderMapLegendBox(svg) {
  var group = svgEl("g", { class: "legend-box-group", id: "map-legend-box-group" });
  svg.appendChild(group);

  var box = MAP_LEGEND_BOX;
  var s = LEGEND_SCALE;
  var titleSize = 14 * s;
  var badgeRadius = 11.5 * s;
  var badgeTextSize = 10.5 * s;
  var nameSize = 10 * s;

  group.appendChild(svgEl("rect", {
    x: box.x, y: box.y, width: box.w, height: box.h,
    rx: 8 * s, fill: "#fdfdfb", stroke: "#111", "stroke-width": 2 * s,
    class: "legend-box"
  }));
  group.appendChild(svgEl("text", {
    x: box.x + 10 * s, y: box.y + 16 * s,
    class: "legend-box-title",
    style: "font-size:" + titleSize + "px"
  })).textContent = "Lines";

  var padding = 10 * s;
  var colW = (box.w - padding * 2) / 2;
  var rowH = 24 * s;
  var rowsStartY = box.y + 38 * s;
  state.data.areas.forEach(function (area, i) {
    var col = i < 5 ? 0 : 1;
    var row = i % 5;
    var cx = box.x + padding + badgeRadius + col * colW;
    var cy = rowsStartY + row * rowH;
    var swatch = svgEl("circle", {
      cx: cx, cy: cy, r: badgeRadius,
      fill: area.color,
      class: "legend-box-swatch",
      "data-area": area.id
    });
    swatch.addEventListener("click", function () { selectArea(area.id); });
    group.appendChild(swatch);

    var swatchText = svgEl("text", {
      x: cx, y: cy + badgeTextSize * 0.34,
      "text-anchor": "middle",
      class: "legend-box-swatch-text",
      "data-area": area.id,
      style: "font-size:" + badgeTextSize + "px"
    });
    swatchText.textContent = area.abbr || "";
    group.appendChild(swatchText);

    var nameText = svgEl("text", {
      x: cx + badgeRadius + 6 * s, y: cy + nameSize * 0.34,
      class: "legend-box-name",
      "data-area": area.id,
      style: "font-size:" + nameSize + "px"
    });
    nameText.textContent = area.name;
    nameText.addEventListener("click", function () { selectArea(area.id); });
    group.appendChild(nameText);
  });
}

// 2026-08-04: the bottom "Lines:" row is now clickable, same as the
// in-map legend box (see renderMapLegendBox's swatch/nameText handlers
// above) - clicking a badge or name here also zooms to that line, so
// there are two equivalent ways to jump to a line instead of one.
function renderLegend() {
  var el = document.getElementById("map-legend");
  if (!el) return;
  var items = state.data.areas.map(function (area) {
    return (
      "<span class=\"legend-item\" data-area=\"" + esc(area.id) + "\" role=\"button\" tabindex=\"0\">" +
      "<span class=\"legend-swatch\" style=\"background:" + area.color + "\">" + esc(area.abbr || "") + "</span>" +
      esc(area.name) +
      "</span>"
    );
  }).join("");
  el.innerHTML = "<span class=\"legend-label\">Lines:</span>" + items;

  el.querySelectorAll(".legend-item[data-area]").forEach(function (item) {
    item.addEventListener("click", function () {
      selectArea(item.getAttribute("data-area"));
    });
    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectArea(item.getAttribute("data-area"));
      }
    });
  });
}

// Clicking a line zooms the map's viewBox toward that line (its full
// routed path, bends included, plus its badge) so it dominates the frame,
// while the existing fade/hidden-station styling recedes everything else.
// Padding ratio (0.12x the line's own extent, floor of 3.75% of the full
// map's width) matches the "tight" framing April approved from the preview
// widget - loose/medium framings were tried and rejected in favor of this.
var mapZoomRAF = null;

function fullViewBoxArray() {
  return LAYOUT.viewBox.split(" ").map(parseFloat);
}

// getBBox() isn't implemented in every environment (e.g. our jsdom-based
// preview renderer) and, in principle, could fail even in a real browser
// on a detached/hidden element - fall back to a rough estimate from
// font-size and character count so zoom-bounds math always has a usable
// box. Real browsers hit the accurate getBBox() path in
// computeLineZoomViewBox below almost all the time; this is the safety net.
function estimateTextBBox(el) {
  var x = parseFloat(el.getAttribute("x")) || 0;
  var y = parseFloat(el.getAttribute("y")) || 0;
  var text = el.textContent || "";
  var fontSize = 16;
  if (el.classList.contains("station-sublabel")) fontSize = 10;
  else if (el.classList.contains("selected")) fontSize = 21;
  else if (el.classList.contains("line-focused")) fontSize = 19;
  var width = text.length * fontSize * 0.58;
  var height = fontSize * 1.1;
  // text-anchor is "middle" on every label/sublabel we create, so x is
  // already the horizontal center; y is the text baseline, so the box
  // extends mostly upward from it.
  return { x: x - width / 2, y: y - height * 0.75, width: width, height: height };
}

function computeLineZoomViewBox(areaId) {
  var pathStr = LAYOUT.linePaths[areaId];
  var pts = [];
  if (pathStr) {
    pathStr.trim().split(/\s+/).forEach(function (pair) {
      var xy = pair.split(",");
      pts.push([parseFloat(xy[0]), parseFloat(xy[1])]);
    });
  }
  var badge = LAYOUT.areaLabelPos[areaId];
  if (badge) pts.push([badge.x, badge.y]);
  if (!pts.length) return null;

  var xs = pts.map(function (p) { return p[0]; });
  var ys = pts.map(function (p) { return p[1]; });
  var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
  var minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);

  // The line's own path + badge don't capture station labels, many of
  // which sit off to one side of their dot via labelOffsetX/Y (e.g.
  // "Targeted mAb", offset 73 units left of its dot) - so bounds based on
  // path/badge alone can clip a label once zoomed in. Fold every visible
  // label/sublabel belonging to this line into the bounds too, measured
  // AFTER applyFocusState() (called just before this, in selectArea) has
  // already applied the enlarged .line-focused / .selected font-size
  // classes, so the box reflects the size the label will actually render
  // at while zoomed.
  var svg = document.getElementById("subway-map");
  if (svg) {
    svg.querySelectorAll("[data-station-label], [data-station-sublabel]").forEach(function (el) {
      var modId = el.getAttribute("data-station-label") || el.getAttribute("data-station-sublabel");
      var mod = state.data.modalities.filter(function (m) { return m.id === modId; })[0];
      if (!mod || mod.areas.indexOf(areaId) === -1) return;
      var box = null;
      if (typeof el.getBBox === "function") {
        try { box = el.getBBox(); } catch (e) { box = null; }
      }
      if (!box || (!box.width && !box.height)) box = estimateTextBBox(el);
      minX = Math.min(minX, box.x);
      maxX = Math.max(maxX, box.x + box.width);
      minY = Math.min(minY, box.y);
      maxY = Math.max(maxY, box.y + box.height);
    });
  }

  var full = fullViewBoxArray();
  var minPad = full[2] * 0.0375;
  var padX = Math.max((maxX - minX) * 0.12, minPad);
  var padY = Math.max((maxY - minY) * 0.12, minPad);
  minX -= padX; maxX += padX; minY -= padY; maxY += padY;

  var cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  var w = maxX - minX, h = maxY - minY;
  var targetAspect = full[2] / full[3];
  if (w / h > targetAspect) {
    h = w / targetAspect;
  } else {
    w = h * targetAspect;
  }

  // Floor the zoom level so a very compact line can't zoom in dramatically
  // further than the others - originally only Ophthalmology (whose own
  // extent is tiny) hit this, zooming in ~3.7x while sprawling lines like
  // Cardiovascular can't zoom in at all. April asked to go back to each
  // line fitting as tightly as possible to its own stations, with this
  // floor only kicking in as a cap on the extreme case - so it's tuned to
  // 2.5x max linear zoom (area ratio 1/2.5^2 = 16%, i.e. 40% per side)
  // rather than a shared target every line gets pulled toward. At this
  // threshold only Ophthalmology is actually affected; every other line's
  // natural tight-fit box is already looser than 40% and passes through
  // unchanged.
  var MIN_ZOOM_W = full[2] * 0.4;
  var MIN_ZOOM_H = full[3] * 0.4;
  if (w < MIN_ZOOM_W) {
    h *= MIN_ZOOM_W / w;
    w = MIN_ZOOM_W;
  } else if (h < MIN_ZOOM_H) {
    w *= MIN_ZOOM_H / h;
    h = MIN_ZOOM_H;
  }

  // Clamp to the full map's own size - a line whose padded extent already
  // approaches the whole map (e.g. Cardiovascular, which sprawls almost
  // edge-to-edge) would otherwise aspect-correct to something BIGGER than
  // the overview itself, i.e. zoom out instead of in. If that happens, cap
  // both dimensions proportionally so the "zoomed" view never exceeds the
  // full map.
  if (w > full[2] || h > full[3]) {
    var scale = Math.min(full[2] / w, full[3] / h);
    w *= scale;
    h *= scale;
  }

  // Keep the zoomed box inside the full map's own bounds - a line whose
  // stations hug one edge (e.g. Cardiovascular, anchored along the far
  // left) pads/aspect-corrects to a box whose center is still near that
  // edge, which can push its far side past the map's actual boundary.
  // Since the background art (river, roads, buildings) is clipped to
  // exactly the full map's viewBox, a viewBox that reaches past it just
  // exposes raw, un-clipped art past where the frame border sits - i.e.
  // April's "river and road streak out of the map" on click-to-zoom. Slide
  // the box back inside bounds (never resize it - w/h are already correct)
  // by the smallest amount needed on each axis.
  var fx0 = full[0], fx1 = full[0] + full[2];
  var fy0 = full[1], fy1 = full[1] + full[3];
  var x0 = cx - w / 2, x1 = cx + w / 2;
  if (x0 < fx0) cx += fx0 - x0;
  else if (x1 > fx1) cx -= x1 - fx1;
  var y0 = cy - h / 2, y1 = cy + h / 2;
  if (y0 < fy0) cy += fy0 - y0;
  else if (y1 > fy1) cy -= y1 - fy1;

  return [cx - w / 2, cy - h / 2, w, h];
}

// Wheel equivalent of computeLineZoomViewBox above - that function reads
// LAYOUT.linePaths/areaLabelPos, which are never populated for
// MOBILE_LAYOUT's wheel geometry (computed at render time, not
// hand-authored), so it always returned null for the wheel and zoom was a
// no-op. This reads the actual rendered dot/label elements for the
// selected spoke instead - always up to date with whatever
// buildWheelMap() just drew, no coordinate table to keep in sync. Called
// AFTER applyFocusState() (see selectArea) so label bboxes reflect the
// enlarged .line-focused font-size they'll actually render at.
function computeWheelZoomViewBox(areaId) {
  var svg = document.getElementById("subway-map");
  if (!svg) return null;
  var full = fullViewBoxArray();
  var hubX = full[0] + full[2] / 2, hubY = full[1] + full[3] / 2;

  // Bounds start at the hub center - a spoke visually starts there, so it
  // should always be included in its own zoom box.
  var minX = hubX, maxX = hubX, minY = hubY, maxY = hubY;
  function grow(x, y) {
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }

  var found = false;
  state.data.modalities.forEach(function (mod) {
    if (mod.areas[0] !== areaId) return;
    found = true;
    var dot = svg.querySelector('[data-station="' + mod.id + '"]');
    if (dot) {
      var r = parseFloat(dot.getAttribute("r")) || 13;
      var dcx = parseFloat(dot.getAttribute("cx"));
      var dcy = parseFloat(dot.getAttribute("cy"));
      grow(dcx - r, dcy - r);
      grow(dcx + r, dcy + r);
    }
    svg.querySelectorAll('[data-station-label="' + mod.id + '"]').forEach(function (label) {
      var box = null;
      if (typeof label.getBBox === "function") {
        try { box = label.getBBox(); } catch (e) { box = null; }
      }
      if (!box || (!box.width && !box.height)) box = estimateTextBBox(label);
      grow(box.x, box.y);
      grow(box.x + box.width, box.y + box.height);
    });
  });
  if (!found) return null;

  var badge = svg.querySelector('.area-badge[data-area="' + areaId + '"]');
  if (badge) {
    var br = parseFloat(badge.getAttribute("r")) || 16;
    var bcx = parseFloat(badge.getAttribute("cx"));
    var bcy = parseFloat(badge.getAttribute("cy"));
    grow(bcx - br, bcy - br);
    grow(bcx + br, bcy + br);
  }

  var padX = Math.max((maxX - minX) * 0.15, full[2] * 0.04);
  var padY = Math.max((maxY - minY) * 0.15, full[3] * 0.04);
  minX -= padX; maxX += padX; minY -= padY; maxY += padY;

  var zcx = (minX + maxX) / 2, zcy = (minY + maxY) / 2;
  var w = maxX - minX, h = maxY - minY;
  var targetAspect = full[2] / full[3];
  if (w / h > targetAspect) h = w / targetAspect; else w = h * targetAspect;

  // Floor the zoom so a spoke with only 1-2 stations can't zoom in
  // dramatically further than a spoke with many - same idea as
  // computeLineZoomViewBox's MIN_ZOOM_W/H, tuned to this wheel's own
  // proportions.
  var MIN_ZOOM_W = full[2] * 0.35;
  var MIN_ZOOM_H = full[3] * 0.35;
  if (w < MIN_ZOOM_W) { h *= MIN_ZOOM_W / w; w = MIN_ZOOM_W; }
  else if (h < MIN_ZOOM_H) { w *= MIN_ZOOM_H / h; h = MIN_ZOOM_H; }

  if (w > full[2] || h > full[3]) {
    var scale = Math.min(full[2] / w, full[3] / h);
    w *= scale;
    h *= scale;
  }

  var fx0 = full[0], fx1 = full[0] + full[2];
  var fy0 = full[1], fy1 = full[1] + full[3];
  var x0 = zcx - w / 2, x1 = zcx + w / 2;
  if (x0 < fx0) zcx += fx0 - x0;
  else if (x1 > fx1) zcx -= x1 - fx1;
  var y0 = zcy - h / 2, y1 = zcy + h / 2;
  if (y0 < fy0) zcy += fy0 - y0;
  else if (y1 > fy1) zcy -= y1 - fy1;

  return [zcx - w / 2, zcy - h / 2, w, h];
}

function animateMapViewBox(target) {
  var svg = document.getElementById("subway-map");
  if (!svg || typeof requestAnimationFrame !== "function") {
    if (svg) svg.setAttribute("viewBox", target.join(" "));
    return;
  }
  if (mapZoomRAF) cancelAnimationFrame(mapZoomRAF);
  var start = svg.getAttribute("viewBox").split(" ").map(parseFloat);
  var t0 = performance.now();
  var dur = 350;
  function step(now) {
    var t = Math.min(1, (now - t0) / dur);
    var e = 1 - Math.pow(1 - t, 3);
    var cur = start.map(function (v, i) { return v + (target[i] - v) * e; });
    svg.setAttribute("viewBox", cur.join(" "));
    mapZoomRAF = t < 1 ? requestAnimationFrame(step) : null;
  }
  mapZoomRAF = requestAnimationFrame(step);
}

function selectArea(areaId) {
  state.selectedArea = areaId;
  state.selectedStation = null;
  state.detailView = null;
  state.comparing = false;
  applyFocusState();
  if (isWheelMode()) {
    rotateBarrelToFront(areaId);
  } else {
    var zoomTarget = computeLineZoomViewBox(areaId);
    if (zoomTarget) animateMapViewBox(zoomTarget);
  }
  document.getElementById("back-btn").classList.remove("hidden");
  document.getElementById("detail-panel").classList.add("hidden");
  syncSheetBackdrop(false);
  var areaObj = state.data.areas.filter(function (a) { return a.id === areaId; })[0];
  document.getElementById("subtitle").textContent = isWheelMode()
    ? "Viewing " + areaObj.name + " - drag to rotate, tap a station for its detail"
    : "Viewing the " + areaObj.name + " line - tap a station, drag to explore other lines";
}

function backToOverview() {
  state.selectedArea = null;
  state.selectedStation = null;
  state.detailView = null;
  state.comparing = false;
  applyFocusState();
  animateMapViewBox(fullViewBoxArray());
  document.getElementById("back-btn").classList.add("hidden");
  document.getElementById("detail-panel").classList.add("hidden");
  syncSheetBackdrop(false);
  document.getElementById("subtitle").textContent = "Tap an area to explore its modalities";
}

function backToStationList() {
  state.selectedStation = null;
  state.detailView = null;
  state.comparing = false;
  applyFocusState();
  document.getElementById("detail-panel").classList.add("hidden");
  syncSheetBackdrop(false);
}

// Multi-line station labels (see LABEL_LINE_GAP / data-anchor-y etc. set
// at creation time above) need a bigger gap between lines whenever their
// font-size grows, or the two lines start to overlap - font-size alone
// doesn't affect the y position an SVG <text> was already placed at. The
// gaps below (22/24) are tuned to the .line-focused (19px) and .selected
// (21px) font-sizes in style.css - if those font-sizes ever change, these
// should be re-tuned to match. Confirmed against April's before/after
// preview animation.
function updateLabelLineSpacing(labels) {
  labels.forEach(function (el) {
    var dist = parseFloat(el.dataset.dist);
    if (!dist) return; // anchor line (dist 0) never moves
    var dir = parseFloat(el.dataset.dir);
    var anchorY = parseFloat(el.dataset.anchorY);
    var gap = el.classList.contains("selected") ? 24
      : el.classList.contains("line-focused") ? 22
      : LABEL_LINE_GAP;
    el.setAttribute("y", anchorY + dir * dist * gap);
  });
}

function applyFocusState() {
  var svg = document.getElementById("subway-map");
  var selectedArea = state.selectedArea;

  svg.querySelectorAll(".line-path").forEach(function (el) {
    var isActive = !selectedArea || el.dataset.area === selectedArea;
    el.classList.toggle("faded", !isActive);
    el.classList.toggle("line-focused", !!selectedArea && isActive);
  });

  svg.querySelectorAll(".area-label").forEach(function (el) {
    var isActive = !selectedArea || el.dataset.area === selectedArea;
    el.classList.toggle("faded", !isActive);
  });

  svg.querySelectorAll(".area-badge, .area-badge-text").forEach(function (el) {
    var isActive = !selectedArea || el.dataset.area === selectedArea;
    el.classList.toggle("faded", !isActive);
  });

  state.data.modalities.forEach(function (mod) {
    var belongsToSelected = selectedArea && mod.areas.indexOf(selectedArea) !== -1;
    var dot = svg.querySelector('[data-station="' + mod.id + '"]');
    var labels = svg.querySelectorAll('[data-station-label="' + mod.id + '"]');
    var sub = svg.querySelector('[data-station-sublabel="' + mod.id + '"]');

    var isSelected = mod.id === state.selectedStation;

    // Interchange pills (square-dot) stay visible on the map at all times,
    // even in the "All lines" overview with nothing selected. Their inner
    // tone-dots/crossing-dashes used to be gated by line selection too
    // (hidden until you clicked a line) - April found that made the pills
    // look like blank white space in the overview, so as of 2026-08-06
    // those render visible from the start and are no longer toggled here.
    // Plain single-line circles keep the original behavior: hidden until
    // their line is selected.
    if (dot && !dot.classList.contains("square-dot")) {
      dot.classList.toggle("hidden-station", !belongsToSelected);
    }
    labels.forEach(function (el) {
      el.classList.toggle("hidden-station", !belongsToSelected);
      el.classList.toggle("line-focused", !!belongsToSelected);
      el.classList.toggle("selected", isSelected);
    });
    updateLabelLineSpacing(labels);
    if (sub) sub.classList.toggle("hidden-station", !belongsToSelected);
    // 2026-08-06: tone-dots/crossing-dashes no longer get hidden-station
    // toggled back on here - they now stay visible at all times (see the
    // buildMap comment above), so this loop was removed.

    if (dot) dot.classList.toggle("selected", isSelected);
  });

  // 2026-08-21: the barrel's strand ribbon/loop colors are computed per-
  // depth in JS (renderBarrelFrame), not via static CSS classes like the
  // rest of this function - so any state change that reaches
  // applyFocusState (select/back/pin, all of which call this) also needs to
  // trigger a barrel color resync, or a selection made while the barrel
  // isn't actively being dragged would silently not repaint.
  if (isWheelMode()) scheduleBarrelRedraw();
}

function selectStation(modId) {
  state.selectedStation = modId;
  state.detailView = "concept";
  state.comparing = false;
  applyFocusState();
  renderDetailPanel();
  spawnSelectPulse(modId);
}

// 2026-08-05 (motion pass): a brief expanding-and-fading ring drawn on top
// of the clicked station's dot, so selecting a station reads as an active
// event rather than a silent class-toggle. Works for both plain circular
// dots (cx/cy/r) and the rect-based interchange pills (x/y/width/height) by
// branching on tagName - matches the same branch used elsewhere (e.g. the
// coordinate-extraction fix in the depth-shadow work) since interchange
// markers are <rect> pills, not <circle> dots. The ring removes itself via
// 'animationend' so repeated clicks don't pile up stray elements.
function spawnSelectPulse(modId) {
  var svg = document.getElementById("subway-map");
  if (!svg) return;
  var dot = svg.querySelector('[data-station="' + modId + '"]');
  if (!dot) return;
  var cx, cy, r;
  if (dot.tagName.toLowerCase() === "rect") {
    var x = parseFloat(dot.getAttribute("x")) || 0;
    var y = parseFloat(dot.getAttribute("y")) || 0;
    var w = parseFloat(dot.getAttribute("width")) || 0;
    var h = parseFloat(dot.getAttribute("height")) || 0;
    cx = x + w / 2;
    cy = y + h / 2;
    r = Math.max(w, h) / 2;
  } else {
    cx = parseFloat(dot.getAttribute("cx")) || 0;
    cy = parseFloat(dot.getAttribute("cy")) || 0;
    r = parseFloat(dot.getAttribute("r")) || 10;
  }
  var ring = svgEl("circle", { cx: cx, cy: cy, r: r, class: "select-pulse" });
  svg.appendChild(ring);
  ring.addEventListener("animationend", function () {
    if (ring.parentNode) ring.parentNode.removeChild(ring);
  });
}

function esc(str) {
  var div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function breadcrumbHtml(area, mod, extra) {
  var parts = [
    '<span class="crumb" data-action="all-lines">All lines</span>',
    '<span class="crumb-sep">&rsaquo;</span>',
    '<span class="crumb" data-action="area">' + esc(area.name) + "</span>"
  ];
  if (extra) {
    parts.push(
      '<span class="crumb-sep">&rsaquo;</span>',
      '<span class="crumb" data-action="concept">' + esc(mod.name) + "</span>",
      '<span class="crumb-sep">&rsaquo;</span>',
      '<span class="crumb current">' + esc(extra) + "</span>"
    );
  } else {
    parts.push(
      '<span class="crumb-sep">&rsaquo;</span>',
      '<span class="crumb current">' + esc(mod.name) + "</span>"
    );
  }
  return '<nav class="breadcrumb">' + parts.join("") + "</nav>";
}

function renderDetailPanel() {
  var panel = document.getElementById("detail-panel");
  var body = document.getElementById("detail-panel-body");
  if (!state.selectedStation) {
    panel.classList.add("hidden");
    syncSheetBackdrop(false);
    return;
  }

  var mod = state.data.modalities.filter(function (m) { return m.id === state.selectedStation; })[0];
  // Wheel mode (see buildWheelMap) lets a station be tapped straight from
  // the unfaded overview, with no line ever selected first - so
  // state.selectedArea can be null here (unlike the metro map, where a
  // station only becomes clickable after selectArea() already ran). Fall
  // back to the modality's own primary area so the breadcrumb still has
  // something to show, without touching state.selectedArea itself (that
  // would trigger applyFocusState's line-focus fade, hiding the wheel's
  // other spokes - not what a plain station tap should do).
  var area = state.data.areas.filter(function (a) { return a.id === state.selectedArea; })[0]
    || state.data.areas.filter(function (a) { return a.id === mod.areas[0]; })[0];
  panel.classList.remove("hidden");
  syncSheetBackdrop(true);

  if (mod.stubOnly) {
    body.innerHTML =
      breadcrumbHtml(area, mod) +
      "<h3>" + esc(mod.name) + "</h3><p class=\"placeholder-note\">Stub station - full content not yet authored.</p>";
    wireBreadcrumb();
    return;
  }

  if (state.detailView === "drugs") {
    body.innerHTML =
      breadcrumbHtml(area, mod, "Example drugs") +
      "<h3>" + esc(mod.name) + " - Example drugs</h3>" +
      "<ul class=\"drug-list\">" + drugListHtml(mod) + "</ul>" +
      "<button class=\"back-inline\" data-action=\"back-to-concept\">&larr; Back to concept</button>";
  } else if (state.detailView === "proscons") {
    var prosItems = mod.pros.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("");
    var consItems = mod.cons.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("");
    body.innerHTML =
      breadcrumbHtml(area, mod, "Pros / Cons") +
      "<h3>" + esc(mod.name) + " - Pros / Cons</h3>" +
      "<div class=\"proscons-grid\">" +
      "<div class=\"proscons-col pros-col\"><h4>Pros</h4><ul>" + prosItems + "</ul></div>" +
      "<div class=\"proscons-col cons-col\"><h4>Cons</h4><ul>" + consItems + "</ul></div>" +
      "</div>" +
      "<p class=\"verdict\"><strong>Verdict:</strong> " + esc(mod.verdict) + "</p>" +
      "<button class=\"back-inline\" data-action=\"back-to-concept\">&larr; Back to concept</button>";
  } else {
    var schematic = "";
    if (mod.schematicParts && mod.schematicParts.length) {
      schematic = "<p class=\"schematic-caption\">Built from: " + mod.schematicParts.map(esc).join(" &middot; ") + "</p>";
    }
    var pinLabel = isPinned(mod.id) ? "📌 Pinned" : "📌 Pin to compare";
    body.innerHTML =
      breadcrumbHtml(area, mod) +
      "<div class=\"layer3-heading\">" +
      "<h3>" + esc(mod.name) + "</h3>" +
      "<button class=\"pin-btn" + (isPinned(mod.id) ? " pinned" : "") + "\" data-action=\"toggle-pin\" data-mod=\"" + esc(mod.id) + "\">" + pinLabel + "</button>" +
      "</div>" +
      "<p>" + esc(mod.concept) + "</p>" +
      schematic +
      "<div class=\"layer3-buttons\">" +
      "<button data-view=\"drugs\">💊 Example drugs</button>" +
      "<button data-view=\"proscons\">⚖ Pros / Cons</button>" +
      "</div>";
  }

  wirePanelButtons();
}

function wireBreadcrumb() {
  document.querySelectorAll(".crumb[data-action]").forEach(function (el) {
    el.addEventListener("click", function () {
      var action = el.dataset.action;
      if (action === "all-lines") backToOverview();
      else if (action === "area") backToStationList();
      else if (action === "concept") {
        state.detailView = "concept";
        renderDetailPanel();
      }
    });
  });
}

function wirePanelButtons() {
  wireBreadcrumb();
  document.querySelectorAll("#detail-panel button[data-view]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.detailView = btn.dataset.view;
      renderDetailPanel();
    });
  });
  var backBtn = document.querySelector('#detail-panel [data-action="back-to-concept"]');
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      state.detailView = "concept";
      renderDetailPanel();
    });
  }
  var pinBtn = document.querySelector('#detail-panel [data-action="toggle-pin"]');
  if (pinBtn) {
    pinBtn.addEventListener("click", function () {
      togglePin(pinBtn.dataset.mod);
    });
  }
}

function wireToolbar() {
  document.getElementById("back-btn").addEventListener("click", backToOverview);
  document.getElementById("compare-btn").addEventListener("click", showCompareView);
  wireDetailSheet();
  wireLegendToggle();
}

// 2026-08-12 (2026-08-13: switched from toggling the in-SVG legend-box to
// popovering the HTML #map-legend list instead - the SVG box is fixed at
// its map-space corner position and would land wherever the user had
// panned/zoomed to, and April wants the badge dropped from the map canvas
// entirely anyway, keeping only this FAB): full-screen mobile layout's
// legend FAB (see #legend-toggle/#map-legend.open in style.css). Both
// elements live outside #app in the static HTML, so they survive every map
// rebuild (line selection, back navigation, etc.) with no stale-reference
// risk - unlike anything drawn inside the SVG itself.
function wireLegendToggle() {
  var btn = document.getElementById("legend-toggle");
  var panel = document.getElementById("map-legend");
  if (!btn || !panel) return;
  btn.addEventListener("click", function () {
    panel.classList.toggle("open");
  });
  // tapping a line inside the popover already jumps the map to it
  // (selectArea, wired in renderLegend) - closing the popover at the same
  // time keeps the map from being covered up by its own legend right when
  // the user is trying to look at the newly-focused line.
  panel.addEventListener("click", function (e) {
    if (e.target.closest(".legend-item")) {
      panel.classList.remove("open");
    }
  });
}

// 2026-08-12: Google-Maps-style bottom sheet for station taps (mobile
// breakpoint only, <=600px, matching MOBILE_LAYOUT's own breakpoint - see
// the #detail-panel rules inside that media query in style.css). The
// backdrop dims the map and closes the sheet on tap; syncSheetBackdrop is
// called from every place that already shows/hides #detail-panel
// (renderDetailPanel, renderComparePanel, selectArea, backToOverview,
// backToStationList) so the backdrop always tracks the panel's own
// visibility rather than needing separate state.
// Tracks the pending "add .hidden back after the fade-out" timer so a
// show->hide->show sequence (e.g. selectArea() closing the sheet and
// selectStation() immediately reopening it, which happens on every single
// station tap - selectArea always resets/hides the panel first as part of
// switching lines) can't leave a stale timer that re-hides the backdrop
// out from under an already-reopened sheet 250ms later.
var sheetHideTimer = null;

function syncSheetBackdrop(visible) {
  var backdrop = document.getElementById("sheet-backdrop");
  if (!backdrop) return;
  if (sheetHideTimer) {
    window.clearTimeout(sheetHideTimer);
    sheetHideTimer = null;
  }
  var mobileOpen = !!(visible && window.innerWidth <= 600);
  // 2026-08-12: drives the full-screen layout's "fade the floating
  // header/toolbar/legend FAB out while the sheet is open" rules in
  // style.css (body.sheet-open ...) - kept in this one funnel function
  // alongside the backdrop itself so both always track the same state.
  document.body.classList.toggle("sheet-open", mobileOpen);
  if (mobileOpen) {
    backdrop.classList.remove("hidden");
    // remove/add on consecutive frames so the opacity transition actually
    // plays instead of jumping straight to visible (display:none -> block
    // has to happen before the opacity change for the CSS transition to
    // be picked up by the browser).
    requestAnimationFrame(function () {
      backdrop.classList.add("visible");
    });
  } else {
    backdrop.classList.remove("visible");
    sheetHideTimer = window.setTimeout(function () {
      backdrop.classList.add("hidden");
      sheetHideTimer = null;
    }, 250);
  }
}

// Closing the sheet (backdrop tap or a swipe-down past the threshold)
// should behave exactly like the equivalent explicit close action would -
// reusing closeCompare/backToStationList instead of just hiding the panel
// directly keeps state.comparing/state.selectedStation/state.pinned
// consistent with every other way of closing it.
function closeDetailSheet() {
  if (state.comparing) {
    closeCompare();
  } else if (state.selectedStation) {
    backToStationList();
  }
}

function wireDetailSheet() {
  var backdrop = document.getElementById("sheet-backdrop");
  var panel = document.getElementById("detail-panel");
  var handle = document.getElementById("sheet-handle");
  if (!backdrop || !panel || !handle) return;

  backdrop.addEventListener("click", closeDetailSheet);

  var dragState = null;
  var DISMISS_THRESHOLD = 90; // px of downward drag before release closes the sheet

  handle.addEventListener("touchstart", function (e) {
    if (window.innerWidth > 600 || !e.touches.length) return;
    var t = e.touches[0];
    dragState = { startY: t.clientY, currentY: t.clientY };
    panel.style.transition = "none";
  }, { passive: true });

  handle.addEventListener("touchmove", function (e) {
    if (!dragState || !e.touches.length) return;
    var t = e.touches[0];
    var dy = Math.max(0, t.clientY - dragState.startY);
    dragState.currentY = t.clientY;
    panel.style.transform = "translateY(" + dy + "px)";
    e.preventDefault();
  }, { passive: false });

  function endDrag() {
    if (!dragState) return;
    var dy = Math.max(0, dragState.currentY - dragState.startY);
    panel.style.transition = "";
    panel.style.transform = "";
    dragState = null;
    if (dy > DISMISS_THRESHOLD) closeDetailSheet();
  }

  handle.addEventListener("touchend", endDrag, { passive: true });
  handle.addEventListener("touchcancel", endDrag, { passive: true });
}

loadAtlas();
