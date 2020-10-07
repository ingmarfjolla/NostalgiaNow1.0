import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";

function ComeBackLater() {
  return (
    <div>
      <Alert variant="warning">
        <Alert.Heading>Hey, nice to see you</Alert.Heading>
        <p>
          Currently, Nostalgia Now cannot and should not be accessed between the
          hours of 12:00 A.M. to 12:30 A.M. on Sundays every week. We are
          currently gathering new nostalgic content to keep our users
          entertained for the new week. So please check back later at another
          time!
        </p>
        <hr />
        <p className="mb-0">
          Note that your favorites page will be emptied out for the new week so
          you can add new items (sort of like Snapchat deleting your stories)
        </p>
      </Alert>
    </div>
  );
}

export default ComeBackLater;
